/**
 * Phase G: Ergänzt leere nightOrder in roles-master.json aus json-on-the-clocktower
 * (roles-combined.json → character_by_id), nur wenn firstNight/otherNight dort gesetzt sind.
 * Überschreibt keine bestehenden Arrays (außer --force-leer ersetzt nur „komplett leer“).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const ROLES_PATH = path.join(ROOT, 'roles', 'roles-master.json');
const UPSTREAM =
  process.env.BOTC_NIGHT_UPSTREAM_URL ||
  'https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function isFabledType(r) {
  return String(r.type || '').toLowerCase() === 'fabled' || String(r.team || '').toLowerCase() === 'fabled';
}

/** Upstream nutzt gelegentlich andere Slugs (bonecollector vs bone_collector). */
function resolveUpstreamChar(byId, roleId) {
  if (!byId || !roleId) return null;
  if (byId[roleId]) return byId[roleId];
  const compact = String(roleId).replace(/_/g, '');
  if (byId[compact]) return byId[compact];
  for (const k of Object.keys(byId)) {
    if (String(k).replace(/_/g, '') === compact) return byId[k];
  }
  return null;
}

function buildSteps(char, roleId, displayName) {
  const firstNight = [];
  const otherNights = [];
  const name = displayName || char.name || roleId;
  const fn = char.firstNight;
  const on = char.otherNight;
  if (fn != null && fn !== '') {
    const label = (char.firstNightReminder && String(char.firstNightReminder).trim())
      ? String(char.firstNightReminder).trim()
      : (String(name) + ': first night');
    firstNight.push({
      order: Number(fn),
      phase: 'first',
      label: name + ': ' + label,
      key: 'first_night'
    });
  }
  if (on != null && on !== '') {
    const label = (char.otherNightReminder && String(char.otherNightReminder).trim())
      ? String(char.otherNightReminder).trim()
      : (String(name) + ': other night');
    otherNights.push({
      order: Number(on),
      phase: 'other',
      label: name + ': ' + label,
      key: 'other_night'
    });
  }
  return { firstNight, otherNights };
}

async function main() {
  const dry = process.argv.includes('--dry');
  const forceLeer = process.argv.includes('--force-leer');

  const data = JSON.parse(fs.readFileSync(ROLES_PATH, 'utf8'));
  const roles = data.roles || {};
  const combined = await fetchJson(UPSTREAM);
  const byId = combined.character_by_id || {};

  let patched = 0;
  let skippedHasLocal = 0;
  let skippedNoUpstream = 0;
  let skippedNoNight = 0;
  const log = [];

  for (const [roleId, r] of Object.entries(roles)) {
    if (isFabledType(r)) continue;

    const fn = Array.isArray(r.nightOrder && r.nightOrder.firstNight) ? r.nightOrder.firstNight : [];
    const on = Array.isArray(r.nightOrder && r.nightOrder.otherNights) ? r.nightOrder.otherNights : [];
    const locallyEmpty = fn.length === 0 && on.length === 0;

    if (!locallyEmpty && !forceLeer) {
      skippedHasLocal++;
      continue;
    }
    if (!locallyEmpty && forceLeer) {
      skippedHasLocal++;
      continue;
    }

    const char = resolveUpstreamChar(byId, roleId);
    if (!char || char.team === '_meta') {
      skippedNoUpstream++;
      continue;
    }
    if (char.firstNight == null && char.otherNight == null) {
      skippedNoNight++;
      continue;
    }

    const displayName = r.name || char.name || roleId;
    const built = buildSteps(char, roleId, displayName);
    if (built.firstNight.length === 0 && built.otherNights.length === 0) {
      skippedNoNight++;
      continue;
    }

    if (!r.nightOrder) r.nightOrder = { firstNight: [], otherNights: [] };
    r.nightOrder.firstNight = built.firstNight;
    r.nightOrder.otherNights = built.otherNights;

    r.firstNightIndex = char.firstNight != null ? char.firstNight : null;
    r.otherNightIndex = char.otherNight != null ? char.otherNight : null;
    if (char.firstNightReminder != null) r.firstNightReminder = char.firstNightReminder;
    if (char.otherNightReminder != null) r.otherNightReminder = char.otherNightReminder;

    patched++;
    log.push(roleId);
  }

  console.log({
    patched,
    skippedHasLocal,
    skippedNoUpstream,
    skippedNoNight,
    ids: log
  });

  if (!dry && patched > 0) {
    fs.writeFileSync(ROLES_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log('Geschrieben:', ROLES_PATH);
  } else if (dry) {
    console.log('--dry: keine Änderung');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
