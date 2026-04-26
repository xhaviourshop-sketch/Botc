const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'roles', 'roles-master.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const roles = data.roles;

// Alle Rollen-IDs aus dem roles-Objekt, nach Typ sortiert
const townsfolk = [];
const outsiders = [];
const minions = [];
const demons = [];
const travelers = [];

Object.keys(roles).forEach(id => {
  const role = roles[id];
  if (!role || !role.type) return;
  const t = role.type.toLowerCase();
  if (t === 'townsfolk') townsfolk.push(id);
  else if (t === 'outsider') outsiders.push(id);
  else if (t === 'minion') minions.push(id);
  else if (t === 'demon') demons.push(id);
  else if (t === 'traveler') travelers.push(id);
});

townsfolk.sort();
outsiders.sort();
minions.sort();
demons.sort();
travelers.sort();

data.scripts.custom = {
  townsfolk,
  outsiders,
  minions,
  demons
};
if (travelers.length > 0) {
  data.scripts.custom.travelers = travelers;
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
const total = townsfolk.length + outsiders.length + minions.length + demons.length + travelers.length;
console.log('Custom script updated (ALL roles):');
console.log('  townsfolk:', townsfolk.length);
console.log('  outsiders:', outsiders.length);
console.log('  minions:', minions.length);
console.log('  demons:', demons.length);
if (travelers.length > 0) console.log('  travelers:', travelers.length);
console.log('  TOTAL:', total);
