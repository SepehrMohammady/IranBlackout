// Iran Blackout - Settings Screen

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useAppStore } from '../store';
import { Card } from '../components';
import { changeLanguage, getCurrentLanguage } from '../i18n';

const SettingsScreen: React.FC = () => {
    const { theme, toggleTheme, colorScheme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'fa';

    const { settings, updateSettings } = useAppStore();
    const [needsRestart, setNeedsRestart] = useState(false);

    const handleLanguageChange = async () => {
        const newLang = getCurrentLanguage() === 'en' ? 'fa' : 'en';
        const restart = await changeLanguage(newLang);
        if (restart) {
            setNeedsRestart(true);
            Alert.alert(
                'Restart Required',
                'Please restart the app for RTL changes to take effect.',
                [{ text: 'OK' }]
            );
        }
        updateSettings({ language: newLang });
    };

    const SettingRow: React.FC<{
        label: string;
        value?: boolean;
        onToggle?: () => void;
        onPress?: () => void;
        rightText?: string;
        icon?: string;
    }> = ({ label, value, onToggle, onPress, rightText, icon }) => (
        <TouchableOpacity
            style={[styles.settingRow, isRTL && styles.settingRowRTL]}
            onPress={onPress}
            disabled={!onPress && !onToggle}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                {icon && <Text style={styles.settingIcon}>{icon}</Text>}
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                    {label}
                </Text>
            </View>

            {onToggle && value !== undefined && (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary + '50'
                    }}
                    thumbColor={value ? theme.colors.primary : theme.colors.textMuted}
                />
            )}

            {rightText && (
                <View style={[styles.rightTextContainer, isRTL && styles.rightTextContainerRTL]}>
                    <Text style={[styles.rightText, { color: theme.colors.textSecondary }]}>
                        {rightText}
                    </Text>
                    <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>
                        {isRTL ? '‹' : '›'}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
        <Text style={[
            styles.sectionHeader,
            { color: theme.colors.textSecondary },
            isRTL && styles.textRTL
        ]}>
            {title}
        </Text>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {t('settings.title')}
                    </Text>
                </View>

                {/* Appearance */}
                <SectionHeader title={t('settings.appearance')} />
                <Card noPadding>
                    <SettingRow
                        icon="🌙"
                        label={t('settings.dark_mode')}
                        value={colorScheme === 'dark'}
                        onToggle={toggleTheme}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <SettingRow
                        icon="🌐"
                        label={t('settings.language')}
                        rightText={getCurrentLanguage() === 'fa' ? 'فارسی' : 'English'}
                        onPress={handleLanguageChange}
                    />
                </Card>

                {/* Notifications */}
                <SectionHeader title={t('settings.notifications')} />
                <Card noPadding>
                    <SettingRow
                        icon="🔔"
                        label={t('settings.push_notifications')}
                        value={settings.pushNotifications}
                        onToggle={() => updateSettings({
                            pushNotifications: !settings.pushNotifications
                        })}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <SettingRow
                        icon="🚨"
                        label={t('alerts.outage_detected')}
                        value={settings.alertOutages}
                        onToggle={() => updateSettings({
                            alertOutages: !settings.alertOutages
                        })}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <SettingRow
                        icon="✅"
                        label={t('alerts.connectivity_restored')}
                        value={settings.alertRestorations}
                        onToggle={() => updateSettings({
                            alertRestorations: !settings.alertRestorations
                        })}
                    />
                </Card>

                {/* Privacy */}
                <SectionHeader title={t('settings.privacy')} />
                <Card noPadding>
                    <SettingRow
                        icon="🔒"
                        label={t('settings.anonymous_reporting')}
                        value={settings.anonymousReporting}
                        onToggle={() => updateSettings({
                            anonymousReporting: !settings.anonymousReporting
                        })}
                    />
                </Card>

                {/* About */}
                <SectionHeader title={t('settings.about')} />
                <Card noPadding>
                    <SettingRow
                        icon="ℹ️"
                        label={t('settings.version')}
                        rightText="0.0.1"
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <SettingRow
                        icon="📖"
                        label={t('settings.source_code')}
                        rightText="GitHub"
                        onPress={() => { }}
                    />
                </Card>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerTagline, { color: theme.colors.primary }]}>
                        ✊ {isRTL ? 'زن، زندگی، آزادی' : 'Woman, Life, Freedom'}
                    </Text>
                    <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
                        {t('about.privacy_statement')}
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
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    textRTL: {
        textAlign: 'right',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    settingRowRTL: {
        flexDirection: 'row-reverse',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLeftRTL: {
        flexDirection: 'row-reverse',
    },
    settingIcon: {
        fontSize: 20,
    },
    settingLabel: {
        fontSize: 16,
    },
    rightTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rightTextContainerRTL: {
        flexDirection: 'row-reverse',
    },
    rightText: {
        fontSize: 14,
    },
    chevron: {
        fontSize: 20,
    },
    divider: {
        height: 1,
        marginLeft: 48,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    footerTagline: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default SettingsScreen;
