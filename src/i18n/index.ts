import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Alert } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import RNRestart from 'react-native-restart';

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

// Handle RTL for Farsi - requires app restart
export const setLanguage = async (languageCode: string): Promise<void> => {
    const isRTL = languageCode === 'fa';
    const needsRestart = I18nManager.isRTL !== isRTL;

    // Change language first
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
