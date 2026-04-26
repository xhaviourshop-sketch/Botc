/**
 * Statische Stichprobe: Rollen in roles-master vs. explizite Keys in botc-abilities.js
 * (Phase-H-Stubs werden im Browser nach loadRoles ergänzt — daher ist „nur Literal“ erwartbar lückenhaft.)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MASTER = path.join(ROOT, 'roles', 'roles-master.json');
const ABILITIES = path.join(ROOT, 'botc-abilities.js');

const data = JSON.parse(fs.readFileSync(MASTER, 'utf8'));
const code = fs.readFileSync(ABILITIES, 'utf8');
const m = code.match(/window\.BOTC_ABILITIES = \{([\s\S]*?)\n  \};/);
const literalKeys = new Set();
if (m) {
  m[1].replace(/^\s+([a-z0-9_]+):/gm, (_, k) => literalKeys.add(k));
}
['harlot', 'thief', 'bureaucrat', 'barista', 'bone_collector'].forEach(k => literalKeys.add(k));

let playable = 0;
const notInLiteral = [];
for (const id of Object.keys(data.roles || {})) {
  const r = data.roles[id];
  if (!r || String(r.type || '').toLowerCase() === 'fabled') continue;
  playable++;
  if (!literalKeys.has(id)) notInLiteral.push(id);
}

console.log('Spielbare Rollen (ohne Fabled):', playable);
console.log('Explizite BOTC_ABILITIES-Keys (ca.):', literalKeys.size);
console.log('Ohne Literal-Eintrag (bekommen Phase-H-Stub im Browser):', notInLiteral.length);
if (process.argv.includes('--verbose')) {
  console.log(notInLiteral.join('\n'));
}
console.log('\nIm Browser nach Start: BOTC_runPhaseHSelfCheck()  → missingHandlers soll [], stubCount hoch.');
