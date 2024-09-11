import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Resources: translations for different languages
import translationEN from './en.json'; // English
import translationHE from './he.json'; // French

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationEN,
            },
            he: {
                translation: translationHE,
            },
        },
        lng: 'en', // default language
        fallbackLng: 'en', // fallback language
        debug: true, // enable debug mode (optional)
        interpolation: {
            escapeValue: false, // not needed for React
        },
    });

export default i18n;