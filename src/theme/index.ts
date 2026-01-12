// Iran Blackout - Theme Provider & Context

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, ThemeColors, ColorScheme } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';

// Theme interface
export interface Theme {
    colors: ThemeColors;
    typography: Typography;
    spacing: Spacing;
    isDark: boolean;
    isRTL: boolean;
}

// Theme context
interface ThemeContextType {
    theme: Theme;
    colorScheme: ColorScheme;
    toggleTheme: () => void;
    setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage keys
const THEME_STORAGE_KEY = '@iranblackout_theme';

// Theme provider
interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>('dark');

    // Load saved theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'dark' || savedTheme === 'light') {
                    setColorSchemeState(savedTheme);
                }
            } catch (error) {
                console.warn('Failed to load theme:', error);
            }
        };
        loadTheme();
    }, []);

    // Save theme when changed
    const setColorScheme = async (scheme: ColorScheme) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
            setColorSchemeState(scheme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    };

    const toggleTheme = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

    const theme: Theme = {
        colors: colors[colorScheme],
        typography,
        spacing,
        isDark: colorScheme === 'dark',
        isRTL: I18nManager.isRTL,
    };

    return (
        <ThemeContext.Provider value= {{ theme, colorScheme, toggleTheme, setColorScheme }
}>
    { children }
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Export everything
export { colors, typography, spacing };
export type { ThemeColors, ColorScheme, Typography, Spacing };
