const fs = require('fs');
const path = require('path');
const appVersion = require('./package.json').version;
const versionFilePath = path.join(__dirname + '/src/version.ts');
const src = `export const ADMIN_DASHBOARD_VERSION = '${appVersion}';\n`;

const existing = fs.existsSync(versionFilePath) ? fs.readFileSync(versionFilePath, 'utf-8') : null;

if (existing === src) {
  console.log(`admin-dashboard version ${appVersion} (unchanged)`);
} else {
  fs.writeFileSync(versionFilePath, src, 'utf-8');
  console.log(`Updating admin-dashboard application version ${appVersion}`);
}
