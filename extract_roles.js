const fs = require('fs');
const content = fs.readFileSync('./globals.js', 'utf8');

// Extrahiere ROLES_DATA  
const match = content.match(/var ROLES_DATA = ({[\s\S]*?});/);
if (!match) {
  console.error('ROLES_DATA not found');
  process.exit(1);
}

const ROLES_DATA = eval('(' + match[1] + ')');

// Ausgabe in strukturiertem Format
const roles = ROLES_DATA.roles;
const scripts = ROLES_DATA.scripts;

// Sammle Rollen pro Script
const rolesByScript = {
  trouble_brewing: { townsfolk: [], outsider: [], minion: [], demon: [] },
  bad_moon_rising: { townsfolk: [], outsider: [], minion: [], demon: [] },
  sects_and_violets: { townsfolk: [], outsider: [], minion: [], demon: [] },
  other: { townsfolk: [], outsider: [], minion: [], demon: [] }
};

Object.entries(roles).forEach(([id, role]) => {
  const roleObj = {
    id: role.id || id,
    name: role.name || '',
    type: (role.type || '').toLowerCase(),
    firstNight: (role.nightOrder?.firstNight || []).length > 0,
    otherNight: (role.nightOrder?.otherNights || []).length > 0,
    firstNightReminder: role.firstNightReminder || '',
    otherNightReminder: role.otherNightReminder || '',
    ability: role.ability || ''
  };

  // Finde Script-Zugehörigkeit
  let scriptFound = false;
  for (const [scriptId, scriptData] of Object.entries(scripts)) {
    if (scriptId === 'custom') continue;
    if (scriptId === 'fabled') continue;
    
    for (const typeKey of Object.keys(scriptData)) {
      const typeMap = { townsfolk: 'townsfolk', outsiders: 'outsider', minions: 'minion', demons: 'demon' };
      const normalizedType = typeMap[typeKey];
      if (normalizedType && scriptData[typeKey].includes(id)) {
        rolesByScript[scriptId][normalizedType].push(roleObj);
        scriptFound = true;
        break;
      }
    }
    if (scriptFound) break;
  }
  
  if (!scriptFound) {
    rolesByScript.other[roleObj.type].push(roleObj);
  }
});

// Ausgabe
console.log(JSON.stringify(rolesByScript, null, 2));
