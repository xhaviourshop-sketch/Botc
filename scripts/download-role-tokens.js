/**
 * Lädt Rollen-Token-PNGs aus roles-master.json (Feld remoteImage) nach assets/tokens/{id}.png.
 * Einmal mit Netzwerk ausführen; danach sind die Bilder offline nutzbar (siehe globals.js roleImageUrlList).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'roles', 'roles-master.json');
const OUT_DIR = path.join(ROOT, 'assets', 'tokens');

function tokenFileKey(roleId) {
  return String(roleId || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
}

function fetchBuffer(url, redirectDepth) {
  if (redirectDepth > 5) return Promise.reject(new Error('Zu viele Weiterleitungen'));
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    lib.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        return fetchBuffer(next, (redirectDepth || 0) + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  const force = process.argv.includes('--force');
  if (!fs.existsSync(JSON_PATH)) {
    console.error('Nicht gefunden:', JSON_PATH);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const roles = data.roles || {};
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  let missingUrl = 0;
  let failed = 0;

  const entries = Object.entries(roles);
  for (let i = 0; i < entries.length; i++) {
    const [id, r] = entries[i];
    const url = r && typeof r.remoteImage === 'string' ? r.remoteImage.trim() : '';
    if (!url) {
      missingUrl++;
      continue;
    }
    const fk = tokenFileKey(id);
    if (!fk) continue;
    const dest = path.join(OUT_DIR, fk + '.png');
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped++;
      continue;
    }
    try {
      const buf = await fetchBuffer(url);
      fs.writeFileSync(dest, buf);
      ok++;
      process.stdout.write(fk + ' ');
      if (ok % 10 === 0) process.stdout.write('\n');
    } catch (e) {
      failed++;
      console.error('\n[' + fk + ']', e.message);
    }
    await new Promise(r => setTimeout(r, 40));
  }
  console.log('\nFertig. ok=' + ok + ' übersprungen=' + skipped + ' ohne URL=' + missingUrl + ' Fehler=' + failed);
  console.log('Ziel:', OUT_DIR);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
