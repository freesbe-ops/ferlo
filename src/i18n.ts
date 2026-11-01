import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ca from './locales/ca.json';
import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import { LANGS } from './lib/lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr }
    },
    // Les rutes reals són /ca, /es, /en i /fr (l'app normalitza el paràmetre
    // :lang), però el detector també ha de suportar variants com "fr-FR".
    supportedLngs: LANGS,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'ca',
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;