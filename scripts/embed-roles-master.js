const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const jsonPath = path.join(dir, 'roles', 'roles-master.json');
const htmlPath = path.join(dir, 'index.html');

let json = fs.readFileSync(jsonPath, 'utf8');
json = json.replace(/<\/script>/gi, '<\\/script>');

let html = fs.readFileSync(htmlPath, 'utf8');
const placeholder = 'INJECT_ROLES_MASTER_JSON_HERE';
if (!html.includes(placeholder)) {
  console.error('Placeholder INJECT_ROLES_MASTER_JSON_HERE not found in index.html');
  process.exit(1);
}
html = html.replace(placeholder, json);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Embedded roles-master.json into index.html');
