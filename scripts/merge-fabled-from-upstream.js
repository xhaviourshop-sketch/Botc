/**
 * Lädt json-on-the-clocktower roles-combined.json und überträgt alle team=fabled
 * Charaktere nach roles/roles-master.json (ohne bestehende Rollen zu überschreiben).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const ROLES_PATH = path.join(ROOT, 'roles', 'roles-master.json');
const UPSTREAM =
  'https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'botc-storyteller-sync' } }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function toRoleEntry(id, u) {
  const setup = !!u.setup;
  return {
    id,
    sourceId: id,
    name: u.name || id,
    team: 'fabled',
    type: 'fabled',
    edition: u.edition || 'base3',
    ability: u.ability || '',
    summary: '',
    reminder: [u.firstNightReminder, u.otherNightReminder].filter(Boolean).join(' ') || '',
    reminders: Array.isArray(u.reminders) ? [...u.reminders] : [],
    remindersGlobal: [],
    setup,
    nightOrder: { firstNight: [], otherNights: [] },
    firstNightIndex: u.firstNight != null ? u.firstNight : null,
    otherNightIndex: u.otherNight != null ? u.otherNight : null,
    firstNightReminder: u.firstNightReminder || '',
    otherNightReminder: u.otherNightReminder || '',
    remoteImage: u.remote_image || u.remoteImage || '',
    sourceUrl: `${UPSTREAM}#${id}`
  };
}

(async () => {
  const data = JSON.parse(fs.readFileSync(ROLES_PATH, 'utf8'));
  const upstream = await fetchJson(UPSTREAM);
  const byId = upstream.character_by_id || {};
  const fabledIds = Object.keys(byId)
    .filter((id) => byId[id].team === 'fabled')
    .sort();

  let added = 0;
  for (const id of fabledIds) {
    if (data.roles[id]) continue;
    data.roles[id] = toRoleEntry(id, byId[id]);
    added++;
  }

  data.scripts = data.scripts || {};
  data.scripts.fabled = fabledIds.filter((id) => data.roles[id]);

  const r = data.roles;
  const cnt = { townsfolk: 0, outsider: 0, minion: 0, demon: 0, traveler: 0, fabled: 0 };
  for (const k of Object.keys(r)) {
    const t = String(r[k].type || '').toLowerCase();
    if (cnt[t] !== undefined) cnt[t]++;
  }
  data.meta = data.meta || {};
  data.meta.generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  data.meta.currentPlayableCounts = {
    townsfolk: cnt.townsfolk,
    outsider: cnt.outsider,
    minion: cnt.minion,
    demon: cnt.demon,
    traveler: cnt.traveler,
    fabled: cnt.fabled,
    total: cnt.townsfolk + cnt.outsider + cnt.minion + cnt.demon + cnt.traveler
  };
  if (!Array.isArray(data.meta.notes)) data.meta.notes = [];
  const line =
    'Fabled roles merged from json-on-the-clocktower (Storyteller-only; not on player script).';
  if (!data.meta.notes.includes(line)) data.meta.notes.push(line);

  fs.writeFileSync(ROLES_PATH, JSON.stringify(data, null, 4), 'utf8');
  console.log('Fabled:', fabledIds.length, 'entries; newly added:', added);
  console.log('Counts:', data.meta.currentPlayableCounts);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
