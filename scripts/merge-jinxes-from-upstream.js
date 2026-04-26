/**
 * Baut roles/jinxes-master.json aus json-on-the-clocktower (roles-combined.json).
 * Rollen-IDs werden über roles-master.json (id + name) aufgelöst.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const ROLES_MASTER = path.join(ROOT, 'roles', 'roles-master.json');
const OUT = path.join(ROOT, 'roles', 'jinxes-master.json');
const UPSTREAM =
  process.env.BOTC_JINX_URL ||
  'https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json';

function normKey(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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

function buildResolveRoleId(rolesObj) {
  const map = new Map();
  for (const [rid, r] of Object.entries(rolesObj || {})) {
    map.set(rid, rid);
    map.set(normKey(rid), rid);
    const n = r && r.name;
    if (n) {
      map.set(normKey(n), rid);
      map.set(String(n).toLowerCase().trim(), rid);
    }
  }
  return function resolve(displayOrId) {
    const raw = String(displayOrId || '').trim();
    if (!raw) return null;
    if (map.has(raw)) return map.get(raw);
    const k = normKey(raw);
    if (map.has(k)) return map.get(k);
    const low = raw.toLowerCase();
    if (map.has(low)) return map.get(low);
    return null;
  };
}

async function main() {
  const master = JSON.parse(fs.readFileSync(ROLES_MASTER, 'utf8'));
  const rolesObj = master.roles || {};
  const resolve = buildResolveRoleId(rolesObj);

  let combined;
  try {
    combined = await fetchJson(UPSTREAM);
  } catch (e) {
    console.error('Upstream-Fetch fehlgeschlagen:', e.message);
    process.exit(1);
  }

  const raw = combined.jinxes;
  if (!Array.isArray(raw)) {
    console.error('Kein jinxes[] im Upstream-JSON');
    process.exit(1);
  }

  const pairs = [];
  const skipped = [];

  for (const block of raw) {
    const aDisplay = block.id;
    const aId = resolve(aDisplay);
    if (!aId) {
      skipped.push({ a: aDisplay, reason: 'unmapped primary' });
      continue;
    }
    const jlist = block.jinx || [];
    for (const j of jlist) {
      const bDisplay = j.id;
      const bId = resolve(bDisplay);
      if (!bId) {
        skipped.push({ a: aDisplay, b: bDisplay, reason: 'unmapped secondary' });
        continue;
      }
      const reason = (j.reason && String(j.reason).trim()) || '';
      pairs.push({
        roleA: aId,
        roleB: bId,
        reason
      });
    }
  }

  const payload = {
    meta: {
      version: 1,
      generatedAt: new Date().toISOString(),
      upstream: UPSTREAM,
      pairCount: pairs.length,
      skippedUnmapped: skipped.length
    },
    jinxPairs: pairs
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Geschrieben:', OUT, '— Paare:', pairs.length, 'übersprungen:', skipped.length);
  if (skipped.length && process.env.BOTC_JINX_VERBOSE) {
    console.log(JSON.stringify(skipped.slice(0, 40), null, 2));
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
