import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';

import 'normalize.css';
import 'antd/dist/antd.css';

import I18n from './i18n';

const webpackContext = require.context('./common/i18n', true, /\.json$/);
webpackContext.keys().forEach(path => {
  const lang = path.replace(/^\.\/(.*)\..+$/, '$1');
  const module = webpackContext(path);
  I18n.addResourceBundle(lang, 'translation', module, true, true);
}, {});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
