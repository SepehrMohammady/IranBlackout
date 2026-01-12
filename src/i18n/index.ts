import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import fa from './locales/fa.json';

const resources = {
    en: { translation: en },
    fa: { translation: fa },
};

// Get device language, default to English
const getDeviceLanguage = (): string => {
    const locales = RNLocalize.getLocales();
    if (locales.length > 0) {
        const languageCode = locales[0].languageCode;
        if (languageCode === 'fa' || languageCode === 'per') {
            return 'fa';
        }
    }
    return 'en';
};

// Initialize i18n
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getDeviceLanguage(),
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Handle RTL for Farsi
export const setLanguage = async (languageCode: string): Promise<void> => {
    const isRTL = languageCode === 'fa';

    if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        // Note: App needs to restart for RTL changes to take effect
    }

    await i18n.changeLanguage(languageCode);
};

export const getCurrentLanguage = (): string => {
    return i18n.language;
};

export const isRTL = (): boolean => {
    return i18n.language === 'fa';
};

export default i18n;
