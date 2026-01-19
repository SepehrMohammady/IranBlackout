import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, typography, ThemeMode } from '../theme';
import { setLanguage } from '../i18n';

// Import version from package.json
const packageJson = require('../../package.json');
const APP_VERSION = packageJson.version;

const SettingsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { colors, mode, setMode, isDark } = useTheme();
    const [telemetryEnabled, setTelemetryEnabled] = useState(true);

    const currentLanguage = i18n.language;

    const handleLanguageChange = async (lang: string) => {
        await setLanguage(lang);
    };

    const handleThemeChange = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const openGitHub = () => {
        Linking.openURL('https://github.com/SepehrMohammady/IranBlackout');
    };

    const themeOptions: { key: ThemeMode; label: string }[] = [
        { key: 'light', label: t('settings.themeLight') },
        { key: 'dark', label: t('settings.themeDark') },
        { key: 'system', label: t('settings.themeSystem') },
    ];

    const languageOptions = [
        { key: 'en', label: 'English', native: 'English' },
        { key: 'fa', label: 'Farsi', native: 'فارسی' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[typography.h2, { color: colors.text }]}>
                        {t('settings.title')}
                    </Text>
                </View>

                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={[typography.label, styles.sectionTitle, { color: colors.textSecondary }]}>
                        {t('settings.appearance')}
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface + 'E6' }]}>
                        <Text style={[typography.body, { color: colors.text }]}>
                            {t('settings.theme')}
                        </Text>
                        <View style={styles.optionsRow}>
                            {themeOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.optionButton,
                                        {
                                            backgroundColor: mode === option.key ? colors.primary : colors.surfaceVariant + '80',
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    onPress={() => handleThemeChange(option.key)}
                                >
                                    <Text
                                        style={[
                                            typography.bodySmall,
                                            { color: mode === option.key ? '#FFFFFF' : colors.text },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.surface + 'E6' }]}>
                        <Text style={[typography.body, { color: colors.text }]}>
                            {t('settings.language')}
                        </Text>
                        <View style={styles.optionsRow}>
                            {languageOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.optionButton,
                                        {
                                            backgroundColor: currentLanguage === option.key ? colors.primary : colors.surfaceVariant + '80',
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    onPress={() => handleLanguageChange(option.key)}
                                >
                                    <Text
                                        style={[
                                            typography.bodySmall,
                                            { color: currentLanguage === option.key ? '#FFFFFF' : colors.text },
                                        ]}
                                    >
                                        {option.native}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <Text style={[typography.label, styles.sectionTitle, { color: colors.textSecondary }]}>
                        {t('settings.privacy')}
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface + 'E6' }]}>
                        <View style={styles.switchRow}>
                            <View style={styles.switchLabel}>
                                <Text style={[typography.body, { color: colors.text }]}>
                                    {t('settings.telemetry')}
                                </Text>
                                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                                    {t('settings.telemetryDesc')}
                                </Text>
                            </View>
                            <Switch
                                value={telemetryEnabled}
                                onValueChange={setTelemetryEnabled}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={telemetryEnabled ? colors.accent : colors.textSecondary}
                            />
                        </View>
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: colors.surfaceVariant + 'E6' }]}>
                        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                            🔒 Your privacy is our priority. We never collect GPS coordinates, personal identifiers,
                            or any data that could identify you. Only anonymous, city-level connectivity data is shared
                            to help document internet disruptions.
                        </Text>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[typography.label, styles.sectionTitle, { color: colors.textSecondary }]}>
                        {t('settings.about')}
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface + 'E6' }]}>
                        <View style={styles.aboutRow}>
                            <Text style={[typography.body, { color: colors.text }]}>
                                {t('common.appName')}
                            </Text>
                            <Text style={[typography.body, { color: colors.textSecondary }]}>
                                {t('settings.version')} {APP_VERSION}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: colors.surface + 'E6' }]}
                        onPress={openGitHub}
                    >
                        <View style={styles.aboutRow}>
                            <Text style={[typography.body, { color: colors.text }]}>
                                {t('settings.openSource')}
                            </Text>
                            <Text style={[typography.body, { color: colors.primary }]}>
                                GitHub →
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
                        {t('messages.accessMatters')}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
                        Made with ❤️ for Iran
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    switchLabel: {
        flex: 1,
        marginRight: 16,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        paddingVertical: 32,
    },
});

export default SettingsScreen;
