import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ZH_CN from './common/i18n/zh-CN.json';
import EN_US from './common/i18n/en-US.json';

I18n
  .use(initReactI18next)
  .init({
    react: {
      useSuspense: false,
    },
    keySeparator: false,
    resources: {
      'zh-CN': {
        translation: ZH_CN
      },
      'EN_US': {
        translation: EN_US
      }
    },
    lng: 'zh-CN'
  }
  );

export default I18n;