'use strict';

const fs = require('fs');
const chalk = require('chalk');

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 'props.t', 't'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: false,
    lngs: ['zh-CN', 'en-US'],
    defaultLng: 'zh',
    resource: {
      loadPath: './src/common/i18n/{{lng}}.json',
      savePath: './src/common/i18n/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    removeUnusedKeys: true,
    nsSeparator: true,
    keySeparator: true,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};