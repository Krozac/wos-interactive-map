// src/i18n/index.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import Cookies from 'js-cookie';

const savedLng = Cookies.get('i18next'); // read cookie

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLng || 'en_US',  // <-- initialize with cookie value or fallback
    fallbackLng: 'en_US',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json', // Usually from public folder
    },
  });

export default i18n;
