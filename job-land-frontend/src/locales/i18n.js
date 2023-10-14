import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import he from './he.json'
import en from './en.json'
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            he: {
                translation: {

                    Email: "אימייל",

                },
            },
            // Add more languages as needed
        },
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language
        interpolation: {
            escapeValue: false, // Not needed for React
        },
    });

export default i18n;