// Iran Blackout - i18n Configuration
// Supports English and Farsi with RTL

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import fa from './locales/fa.json';

const LANGUAGE_STORAGE_KEY = '@iranblackout_language';

// Get device language
const getDeviceLanguage = (): string => {
    let deviceLanguage = 'en';

    if (Platform.OS === 'android') {
        deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
    } else {
        deviceLanguage = NativeModules.SettingsManager?.settings?.AppleLocale ||
            NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'en';
    }

    // Check if device is in Persian/Farsi
    if (deviceLanguage.startsWith('fa') || deviceLanguage.startsWith('per')) {
        return 'fa';
    }

    return 'en';
};

// Persian number conversion
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianNumbers = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
};

export const toEnglishNumbers = (str: string): string => {
    const persianToEnglish: Record<string, string> = {
        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    };
    return str.replace(/[۰-۹]/g, (digit) => persianToEnglish[digit] || digit);
};

// Format number based on current language
export const formatNumber = (num: number | string): string => {
    const currentLang = i18n.language;
    if (currentLang === 'fa') {
        return toPersianNumbers(num);
    }
    return String(num);
};

// Initialize i18n
const initI18n = async () => {
    // Load saved language preference
    let savedLanguage: string | null = null;
    try {
        savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to load language preference:', error);
    }

    const initialLanguage = savedLanguage || getDeviceLanguage();

    await i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: en },
                fa: { translation: fa },
            },
            lng: initialLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });

    // Set RTL based on language
    const isRTL = initialLanguage === 'fa';
    if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
    }
};

// Change language function
export const changeLanguage = async (lang: 'en' | 'fa'): Promise<boolean> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        await i18n.changeLanguage(lang);

        // Handle RTL
        const isRTL = lang === 'fa';
        if (I18nManager.isRTL !== isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);
            // Note: App needs to restart for RTL changes to take effect
            return true; // Indicates restart needed
        }

        return false;
    } catch (error) {
        console.error('Failed to change language:', error);
        return false;
    }
};

// Get current language
export const getCurrentLanguage = (): 'en' | 'fa' => {
    return i18n.language as 'en' | 'fa';
};

// Check if current language is RTL
export const isRTL = (): boolean => {
    return I18nManager.isRTL;
};

// Initialize
initI18n();

export default i18n;
