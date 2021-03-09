const fs = require('fs');
const path = require('path');

const LOCALE_PATH = path.resolve(__dirname, '../', 'src', 'common', 'i18n');

const file = fs.readFileSync(path.join(LOCALE_PATH, 'zh-CN.json'), 'utf-8');
const data = JSON.parse(file);

for (const key in data) {
  data[key] = key;
}

fs.writeFileSync(path.join(LOCALE_PATH, 'zh-CN.json'), JSON.stringify(data, null, 2));
