// Iran Blackout - Typography
// Bold, minimal, trustworthy

import { Platform } from 'react-native';

// System fonts with Persian/Arabic support
const fontFamily = Platform.select({
    android: 'Roboto',
    ios: 'System',
    default: 'System',
});

const fontFamilyPersian = Platform.select({
    android: 'IRANSans', // Common Persian font for Android
    ios: 'System',
    default: 'System',
});

export const typography = {
    // Font families
    fontFamily,
    fontFamilyPersian,

    // Font sizes
    sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 22,
        xxxl: 28,
        display: 34,
        hero: 48,
    },

    // Font weights
    weights: {
        light: '300' as const,
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        black: '900' as const,
    },

    // Line heights
    lineHeights: {
        tight: 1.1,
        normal: 1.4,
        relaxed: 1.6,
        loose: 1.8,
    },

    // Predefined text styles
    styles: {
        hero: {
            fontSize: 48,
            fontWeight: '900' as const,
            lineHeight: 52,
            letterSpacing: -1,
        },
        h1: {
            fontSize: 28,
            fontWeight: '700' as const,
            lineHeight: 34,
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: 22,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        h3: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        label: {
            fontSize: 12,
            fontWeight: '600' as const,
            lineHeight: 16,
            letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 20,
            letterSpacing: 0.3,
        },
    },
};

export type Typography = typeof typography;
