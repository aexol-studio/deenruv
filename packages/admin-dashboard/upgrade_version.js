const fs = require('fs');
const path = require('path');
const appVersion = require('./package.json').version;
const versionFilePath = path.join(__dirname + '/src/version.ts');
const src = `export const ADMIN_DASHBOARD_VERSION = '${appVersion}';`;
fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
  if (err) return console.log(err);
  console.log(`Updating admin-dashboard application version ${appVersion}`);
});
