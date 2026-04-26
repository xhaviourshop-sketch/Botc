/**
 * Lokale Smoke-Checks ohne Browser (Exit 0 = ok).
 * Nutzung: node scripts/smoke-checks.js
 */
const { spawnSync } = require('child_process');
const path = require('path');
const root = path.join(__dirname, '..');

function runNode(rel, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, rel), ...args], {
    encoding: 'utf8',
    cwd: root
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return r.status === 0;
}

let ok = true;
console.log('═══ Smoke checks (BotC Storyteller) ═══\n');
if (!runNode('scripts/check-botc-abilities.js')) {
  console.error('[FAIL] abilities:check');
  ok = false;
}
try {
  const fs = require('fs');
  const audit = JSON.parse(fs.readFileSync(path.join(root, 'roles', 'night-order-audit-report.json'), 'utf8'));
  const n = audit.upstreamLocalMismatchCount;
  if (typeof n === 'number' && n !== 0) {
    console.error('[FAIL] night-order-audit upstreamLocalMismatchCount:', n);
    ok = false;
  } else {
    console.log('[OK] night-order-audit upstreamLocalMismatchCount:', n);
  }
} catch (e) {
  console.error('[FAIL] audit JSON:', e.message);
  ok = false;
}
process.exit(ok ? 0 : 1);
