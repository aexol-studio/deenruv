import i18next from 'i18next';
// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useSettings } from '@deenruv/react-ui-devkit';

export const defaultNS = 'common';

i18next.use(LanguageDetector).use(initReactI18next).init({
  resources: undefined,
  lng: useSettings.getState().language,
  defaultNS,
  fallbackLng: 'en',
});
export default i18next;
