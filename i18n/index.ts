import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';
import pt from './locales/pt.json';

export const LANGUAGE_STORAGE_KEY = 'SMARTMOTTU_LANGUAGE';

export const supportedLanguages = [
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
] as const;

export type SupportedLanguageCode = typeof supportedLanguages[number]['code'];

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && supportedLanguages.some(lang => lang.code === storedLanguage)) {
        return callback(storedLanguage);
      }
      const locales = Localization.getLocales();
      const systemLocale = locales && locales.length > 0 ? locales[0].languageCode : undefined;
      if (systemLocale && supportedLanguages.some(lang => lang.code === systemLocale)) {
        return callback(systemLocale);
      }
    } catch (error) {
      console.warn('Failed to detect language automatically', error);
    }
    callback('pt');
  },
  init: () => undefined,
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to persist language selection', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'pt',
    supportedLngs: supportedLanguages.map(lang => lang.code),
    resources: {
      pt: { translation: pt },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = async (language: SupportedLanguageCode) => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18n;
