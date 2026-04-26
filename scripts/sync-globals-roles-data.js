/**
 * Ersetzt den Block `var ROLES_DATA = { ... };` in globals.js durch roles/roles-master.json.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GLOB = path.join(ROOT, 'globals.js');
const JSON_PATH = path.join(ROOT, 'roles', 'roles-master.json');

function findClosingBrace(js, openIndex) {
  let depth = 0;
  let i = openIndex;
  const len = js.length;
  for (; i < len; i++) {
    const ch = js[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch;
      i++;
      while (i < len) {
        if (js[i] === '\\') {
          i += 2;
          continue;
        }
        if (js[i] === q) break;
        i++;
      }
      continue;
    }
    if (ch === '/' && js[i + 1] === '/') {
      i += 2;
      while (i < len && js[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && js[i + 1] === '*') {
      i += 2;
      while (i < len - 1 && !(js[i] === '*' && js[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const marker = 'var ROLES_DATA = ';
let globals = fs.readFileSync(GLOB, 'utf8');
const start = globals.indexOf(marker);
if (start === -1) {
  console.error('Marker not found:', marker);
  process.exit(1);
}
let brace = start + marker.length;
while (brace < globals.length && /\s/.test(globals[brace])) brace++;
if (globals[brace] !== '{') {
  console.error('Expected { after ROLES_DATA');
  process.exit(1);
}
const close = findClosingBrace(globals, brace);
if (close < 0) {
  console.error('Unbalanced braces in globals.js');
  process.exit(1);
}
let end = close + 1;
while (end < globals.length && /\s/.test(globals[end])) end++;
if (globals[end] === ';') end++;

const pretty = JSON.stringify(JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')), null, 4);
const out = globals.slice(0, start) + marker + pretty + ';' + globals.slice(end);
fs.writeFileSync(GLOB, out, 'utf8');
console.log('globals.js ROLES_DATA synced from roles-master.json');
