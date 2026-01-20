import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Alert } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import fa from './locales/fa.json';

const LANGUAGE_KEY = '@iranblackout_language';

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

// Get saved language or device language
const getSavedLanguage = async (): Promise<string> => {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang && (savedLang === 'en' || savedLang === 'fa')) {
            return savedLang;
        }
    } catch (e) {
        console.warn('Failed to get saved language:', e);
    }
    return getDeviceLanguage();
};

// Initialize with saved language (async)
export const initializeLanguage = async (): Promise<void> => {
    const savedLang = await getSavedLanguage();
    if (savedLang !== i18n.language) {
        await i18n.changeLanguage(savedLang);
    }
};

// Initialize i18n with default (will be updated by initializeLanguage)
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: I18nManager.isRTL ? 'fa' : 'en', // Match RTL state on start
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Handle RTL for Farsi - requires app restart
export const setLanguage = async (languageCode: string): Promise<void> => {
    const isRTL = languageCode === 'fa';
    const needsRestart = I18nManager.isRTL !== isRTL;

    // Save language preference FIRST (before restart)
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    } catch (e) {
        console.warn('Failed to save language:', e);
    }

    // Change language
    await i18n.changeLanguage(languageCode);

    // If RTL state needs to change, prompt for restart
    if (needsRestart) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);

        // Show restart prompt
        Alert.alert(
            languageCode === 'fa' ? 'راه‌اندازی مجدد برنامه' : 'Restart Required',
            languageCode === 'fa'
                ? 'برای اعمال تغییرات زبان، برنامه باید راه‌اندازی مجدد شود.'
                : 'The app needs to restart to apply language changes.',
            [
                {
                    text: languageCode === 'fa' ? 'راه‌اندازی مجدد' : 'Restart Now',
                    onPress: () => RNRestart.restart(),
                },
                {
                    text: languageCode === 'fa' ? 'بعداً' : 'Later',
                    style: 'cancel',
                },
            ]
        );
    }
};

export const getCurrentLanguage = (): string => {
    return i18n.language;
};

export const isRTL = (): boolean => {
    return I18nManager.isRTL;
};

export default i18n;
