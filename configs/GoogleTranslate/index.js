const fs = require('fs');
const { join, resolve } = require('path');
const translate = require('google-translate-api');
const conf = require('./config.js'); // 獲取配置信息
const initial = require('./initial');
const fileItem = [];
let num = 0; // 计数器
const SOURCE_PATH = resolve(__dirname, '../../', 'src', 'common', 'locales');

function getJsonFiles(jsonPath) {
  const jsonFiles = [];
  let i = 0;
  function findJsonFile(path) {
    const files = fs.readdirSync(path);

    for (let n = 0; n < /* files.length*/ 1; n++) {
      const fPath = join(path, files[n]);
      const stat = fs.statSync(fPath);
      const tempPath = fPath.substring(fPath.lastIndexOf('\\') + 1, fPath.length);
      if (
        stat.isDirectory() &&
        conf.cf.skipFolderName.indexOf(tempPath) == -1 &&
        conf.cf.skipPath.indexOf(fPath) == -1
      ) {
        //
        findJsonFile(fPath);
      }
      if (stat.isFile()) {
        jsonFiles.push(...fPath);
        readFileKeyword(fPath, m => {
          fileItem.push(...Object.keys(m));
        });
        i++;
      }
    }
  }
  findJsonFile(jsonPath);

  const initData = deletRrepetitionItemAndFormat(fileItem);

  // 翻譯
  conf.cf.languages.forEach(el => {
    if (el === 'zh-CN') {
      return;
    }
    if (el === 'en-US') {
      writeTranlateData(`${SOURCE_PATH}/${el}.json`, initData, 'en', conf.cf.Mode);
    } else {
      writeTranlateData(`${SOURCE_PATH}/${el}.json`, initData, el, conf.cf.Mode);
    }
  });
}

/**
 * 判斷文件是否存在
 * @param {string} path -文件路勁
 * @return {bool} -true存在 false不存在
 */
function fsExistsSync(path) {
  try {
    fs.accessSync(path);
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}
/**
 * 读取文件中的指定数据
 * @param {string} path - 傳入文件夾地址相對路徑
 * @param {function} fn -回調函數
 */
function readFileKeyword(path, fn) {
  const str = fs.readFileSync(path, 'utf-8');

  const temp = [];
  // for (const n in conf.cf.patterns) {
  //   const m = str.match(conf.cf.patterns[n]);
  //   if (m) {
  //     temp.push(...m);
  //   }
  // }
  if (str.length) {
    fn(JSON.parse(str));
  }
}

/**
 * 數據去重並格式化數據
 * @param {Array} arr- 需要去重的數組
 * @return {Array} -返回已去重的數組
 */
function deletRrepetitionItemAndFormat(arr) {
  const Arr = new Set(arr);
  const temp = [];
  Array.from(Arr).forEach(el => {
    num++; // 计数器自增
    temp.push({
      text: el,
      orderBy: num,
      translate: '',
    });
  });
  return temp;
}

/**
 * 寫入文件
 * @param {String} path - 寫入文件的路徑
 * @param {String} str -寫入文件的數據
 */
function writeFile(path, str) {
  // fs.appendFileSync(path,str);
  fs.writeFileSync(path, str);
}

/**
 * 多語言翻譯
 * @param {String} data -需要翻譯的數據
 * @param {String} language -需要翻譯成的語言 如 en 、 zh-TW 、 zh-CN
 * @param {function} callback - 翻譯後的回調函數
 */
function Translate(data, language, callback) {
  translate(data, { to: language })
    .then(res => {
      console.log(res);
      callback(res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
}

/**
 * 排序
 */
function compare(propertyName) {
  return function (obj1, obj2) {
    const value1 = obj1[propertyName];
    const value2 = obj2[propertyName];
    return value1 - value2;
  };
}

/**
 * 讀取文件
 * @param {String} path -讀取文件
 *
 */
function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

/**
 *
 * @param {String} path - 寫入文件地址
 * @param {Array} initData -寫入文件的數據
 * @param {String} language -需要寫入的語言
 * @param {String} ModeStat-寫入語言的狀態
 */
function writeTranlateData(path, initData, language, ModeStat) {
  const temp = [];

  initData.map(item => {
    Translate(item.text, language, res => {
      if (conf.cf.skipEnglishKey && res.from.language.iso == 'en') {
        temp.push({
          text: item.text,
          orderBy: item.orderBy,
          translate: item.text,
        });
      } else {
        temp.push({
          text: item.text,
          orderBy: item.orderBy,
          translate: res.text.replace(/(^\s*)|(\s*$)/g, ''),
        });
      }
      if (temp.length == initData.length) {
        let str = '{\n';
        temp.sort(compare('orderBy')).forEach((el, index) => {
          str += `    "${el.text}": "${el.translate}",\n`;
        });
        str = str.substring(0, str.length - 2);
        str += '\n}';

        if (ModeStat == 'Append') {
          // 狀態為追加
          if (fsExistsSync(path)) {
            let readData = fs.readFileSync(path, 'utf-8');
            readData = JSON.parse(readData);
            const strJson = JSON.parse(str);
            for (const i in readData) {
              delete strJson[i];
            }
            for (const n in strJson) {
              readData[n] = strJson[n];
            }
            let writeStr = '{\n';
            for (const i in readData) {
              writeStr += `  "${i}": "${readData[i]}",\n`;
            }
            writeStr = writeStr.substring(0, writeStr.length - 2);
            writeStr += '\n}';
            writeFile(path, writeStr);
          }
        }
        if (ModeStat == 'Create') {
          // 狀態為創建

          writeFile(path, str);
        }
        return;
      }
    });
  });
}

// initial(); // 替换 API 目的域名
getJsonFiles(conf.cf.sourceCodePath); // 執行入口