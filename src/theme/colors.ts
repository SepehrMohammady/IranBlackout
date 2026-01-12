// Iran Blackout - Color Palette
// Activist, supportive, and empowering design

export const colors = {
    dark: {
        // Core backgrounds
        background: '#0A0A0F',
        surface: '#141420',
        surfaceElevated: '#1E1E2E',

        // Primary - Cyan signal/connectivity
        primary: '#00D9FF',
        primaryDark: '#0099B3',
        primaryLight: '#66E8FF',

        // Accent - Gold for hope/freedom
        accent: '#FFD700',
        accentDark: '#B39700',
        accentLight: '#FFE866',

        // Status colors
        online: '#22C55E',
        onlineLight: '#4ADE80',
        limited: '#F59E0B',
        limitedLight: '#FBBF24',
        offline: '#EF4444',
        offlineLight: '#F87171',

        // Text
        text: '#FFFFFF',
        textSecondary: '#A0A0B0',
        textMuted: '#6B6B7B',

        // Borders & dividers
        border: '#2A2A3A',
        divider: '#1F1F2F',

        // Overlay for modals
        overlay: 'rgba(0, 0, 0, 0.7)',
    },

    light: {
        // Core backgrounds
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Primary
        primary: '#0077B6',
        primaryDark: '#005580',
        primaryLight: '#00A8E8',

        // Accent
        accent: '#D4A017',
        accentDark: '#9A7512',
        accentLight: '#EDB41C',

        // Status colors
        online: '#16A34A',
        onlineLight: '#22C55E',
        limited: '#D97706',
        limitedLight: '#F59E0B',
        offline: '#DC2626',
        offlineLight: '#EF4444',

        // Text
        text: '#1A1A2E',
        textSecondary: '#4A4A5A',
        textMuted: '#8A8A9A',

        // Borders & dividers
        border: '#E0E0E8',
        divider: '#F0F0F5',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
};

export type ThemeColors = typeof colors.dark;
export type ColorScheme = 'dark' | 'light';
