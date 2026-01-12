import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, I18nManager } from 'react-native';
import { colors, ThemeColors } from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors & { primary: string; accent: string; online: string; limited: string; offline: string; unknown: string };
    setMode: (mode: ThemeMode) => void;
    isRTL: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    const isDark = mode === 'system'
        ? systemColorScheme === 'dark'
        : mode === 'dark';

    const themeColors = {
        ...(isDark ? colors.dark : colors.light),
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        primaryDark: colors.primaryDark,
        accent: colors.accent,
        accentLight: colors.accentLight,
        accentDark: colors.accentDark,
        online: colors.online,
        limited: colors.limited,
        offline: colors.offline,
        unknown: colors.unknown,
    };

    const value: ThemeContextType = {
        mode,
        isDark,
        colors: themeColors,
        setMode,
        isRTL: I18nManager.isRTL,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
