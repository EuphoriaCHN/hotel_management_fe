import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';

I18n
  .use(initReactI18next)
  .init({
    react: {
      useSuspense: false,
    },
    keySeparator: false,
    resources: {},
    lng: 'zh-CN'
  }
  );

export default I18n;