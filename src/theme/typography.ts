import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
    // Headers
    h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
        letterSpacing: -0.25,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    h4: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
    },

    // Body text
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },

    // Captions and labels
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Special
    button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0.25,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
    },
});

// Farsi number conversion
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianNumber = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

export const toEnglishNumber = (str: string): string => {
    return str.replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)));
};
