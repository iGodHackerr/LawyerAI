import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Use the http backend to load translation files from the /public folder
  .use(HttpApi)
  // Automatically detect the user's language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Define which languages are supported
    supportedLngs: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'],
    // The default language to use if detection fails
    fallbackLng: 'en',
    // Configuration for language detection
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Where to cache the detected language
    },
    // Where to find the translation files
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    // Options for react-i18next
    react: {
      // Use Suspense for lazy loading translations
      useSuspense: true,
    },
  });

export default i18n;
