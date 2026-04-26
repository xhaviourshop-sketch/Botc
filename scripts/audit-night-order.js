/**
 * Phase G: Analyse von roles/roles-master.json — nightOrder, Indizes, Plausibilität.
 * Optional: --with-upstream klassifiziert leere Einträge gegen json-on-the-clocktower.
 *
 * Ausgabe: Konsole + optional roles/night-order-audit-report.json
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const ROLES_PATH = path.join(ROOT, 'roles', 'roles-master.json');
const REPORT_PATH = path.join(ROOT, 'roles', 'night-order-audit-report.json');
const UPSTREAM =
  process.env.BOTC_AUDIT_UPSTREAM_URL ||
  'https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json';

/** Starke Signale für „wacht aktiv in der Nacht“ (ST-Schritt sinnvoll). */
const STRONG_NIGHT_ACTION = /\b(each\s+night|every\s+night|once\s+per\s+game,?\s*at\s+night|at\s+night,?\s*choose|each\s+night\*?,?\s*choose|open\s+your\s+eyes\s+at\s+night)\b/i;

function isFabled(r) {
  return String(r.type || '').toLowerCase() === 'fabled' || String(r.team || '').toLowerCase() === 'fabled';
}

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

async function main() {
  const writeJson = process.argv.includes('--write-report');
  const withUpstream = process.argv.includes('--with-upstream');

  const raw = fs.readFileSync(ROLES_PATH, 'utf8');
  const data = JSON.parse(raw);
  const roles = data.roles || {};

  let byId = null;
  if (withUpstream) {
    try {
      const combined = await fetchJson(UPSTREAM);
      byId = combined.character_by_id || {};
    } catch (e) {
      console.error('Upstream-Fetch fehlgeschlagen:', e.message);
      process.exit(1);
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    upstream: withUpstream ? UPSTREAM : null,
    roleCount: Object.keys(roles).length,
    emptyBothNightArrays: [],
    fabledEmptyBoth: [],
    indexMismatch: [],
    strongNightActionButEmpty: [],
    missingNightOrderObject: [],
    emptyWithUpstreamClass: [],
    travelerById: {}
  };

  for (const [id, r] of Object.entries(roles)) {
    if (!r.nightOrder || typeof r.nightOrder !== 'object') {
      summary.missingNightOrderObject.push(id);
      continue;
    }
    const fn = Array.isArray(r.nightOrder.firstNight) ? r.nightOrder.firstNight : [];
    const on = Array.isArray(r.nightOrder.otherNights) ? r.nightOrder.otherNights : [];
    const emptyBoth = fn.length === 0 && on.length === 0;

    if (isFabled(r)) {
      if (emptyBoth) summary.fabledEmptyBoth.push(id);
      continue;
    }

    if (emptyBoth) {
      summary.emptyBothNightArrays.push(id);
      const ab = String(r.ability || '');
      if (STRONG_NIGHT_ACTION.test(ab)) {
        summary.strongNightActionButEmpty.push({ id, snippet: ab.slice(0, 140) });
      }

      if (byId) {
        const u = resolveUpstreamChar(byId, id);
        let klass = 'no_upstream_row';
        if (u) {
          if (u.team === '_meta') klass = 'meta';
          else if (u.firstNight != null || u.otherNight != null) klass = 'upstream_has_order_but_local_empty_bug';
          else klass = 'upstream_also_no_night_index';
        }
        summary.emptyWithUpstreamClass.push({ id, klass });
      }
    }

    const hasFnIdx = r.firstNightIndex != null && r.firstNightIndex !== '';
    const hasOnIdx = r.otherNightIndex != null && r.otherNightIndex !== '';
    if (hasFnIdx && fn.length === 0) {
      summary.indexMismatch.push({ id, issue: 'firstNightIndex but firstNight[] empty', firstNightIndex: r.firstNightIndex });
    }
    if (hasOnIdx && on.length === 0) {
      summary.indexMismatch.push({ id, issue: 'otherNightIndex but otherNights[] empty', otherNightIndex: r.otherNightIndex });
    }

    if (String(r.type || '').toLowerCase() === 'traveler') {
      summary.travelerById[id] = { emptyBoth, firstCount: fn.length, otherCount: on.length };
    }
  }

  const meta = data.meta || {};
  const c = meta.currentPlayableCounts || {};
  const sumCounts =
    (c.townsfolk || 0) +
    (c.outsider || 0) +
    (c.minion || 0) +
    (c.demon || 0) +
    (c.traveler || 0);
  const fabledC = c.fabled || 0;
  summary.metaChecksum = {
    sumScriptRolesExcludingFabled: sumCounts,
    fabled: fabledC,
    impliedTotalInDataset: sumCounts + fabledC,
    roleKeysInFile: Object.keys(roles).length,
    metaTotalsBlockOk: meta.totals && meta.totals.rolesInDataset === Object.keys(roles).length
  };

  if (summary.emptyWithUpstreamClass.length) {
    const buggy = summary.emptyWithUpstreamClass.filter(x => x.klass === 'upstream_has_order_but_local_empty_bug');
    summary.upstreamLocalMismatchCount = buggy.length;
    if (buggy.length) summary.upstreamLocalMismatchIds = buggy.map(x => x.id);
  }

  console.log('═══ Night-Order Audit (Phase G) ═══');
  console.log(JSON.stringify(summary, null, 2));
  console.log('─── Kurz ---');
  console.log('Leer (ohne Fabled):', summary.emptyBothNightArrays.length);
  console.log('Fabled leer:', summary.fabledEmptyBoth.length);
  console.log('Index-Mismatch:', summary.indexMismatch.length);
  console.log('Starke Nacht-Aktion im Text, aber leer:', summary.strongNightActionButEmpty.length);
  if (withUpstream && summary.upstreamLocalMismatchCount) {
    console.log('WARN: Upstream hat Nacht-Index, lokal leer:', summary.upstreamLocalMismatchIds);
  }
  console.log('fehlendes nightOrder:', summary.missingNightOrderObject.length);

  if (writeJson) {
    fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2), 'utf8');
    console.log('Report:', REPORT_PATH);
  }

  if (summary.indexMismatch.length || summary.upstreamLocalMismatchCount) {
    process.exitCode = 1;
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
