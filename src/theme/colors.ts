// IranBlackout Color Palette
// Activist-aligned: bold, trustworthy, resilient

export const colors = {
    // Primary - Deep blue representing trust and freedom
    primary: '#1E3A5F',
    primaryLight: '#2E5A8F',
    primaryDark: '#0D1F33',

    // Accent - Warm amber for hope and resilience
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',

    // Status colors
    online: '#10B981',      // Green - Connected
    limited: '#F59E0B',     // Amber - Partial connectivity
    offline: '#EF4444',     // Red - No connectivity
    unknown: '#6B7280',     // Gray - Unknown status

    // Light theme
    light: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        divider: '#E2E8F0',
    },

    // Dark theme
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        surfaceVariant: '#334155',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#334155',
        divider: '#1E293B',
    },
};

export type ThemeColors = typeof colors.light;
