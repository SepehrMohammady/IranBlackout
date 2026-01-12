// Iran Blackout - Alerts Screen

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useAppStore } from '../store';
import { Card, StatusDot } from '../components';
import { Alert } from '../types';

const AlertsScreen: React.FC = () => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'fa';

    const { alerts, markAlertRead, clearAllAlerts } = useAppStore();

    const getAlertIcon = (type: Alert['type']) => {
        switch (type) {
            case 'outage': return '🔴';
            case 'restoration': return '🟢';
            case 'limited': return '🟡';
            default: return 'ℹ️';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (minutes < 60) {
            return isRTL ? `${minutes} دقیقه پیش` : `${minutes}m ago`;
        } else if (hours < 24) {
            return isRTL ? `${hours} ساعت پیش` : `${hours}h ago`;
        } else {
            return new Date(date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={[styles.header, isRTL && styles.headerRTL]}>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            {t('alerts.title')}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            {t('alerts.subtitle')}
                        </Text>
                    </View>

                    {alerts.length > 0 && (
                        <TouchableOpacity
                            onPress={clearAllAlerts}
                            style={[styles.clearButton, { borderColor: theme.colors.border }]}
                        >
                            <Text style={[styles.clearButtonText, { color: theme.colors.primary }]}>
                                {t('alerts.clear_all')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Alerts list */}
                {alerts.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                            {t('alerts.no_alerts')}
                        </Text>
                    </Card>
                ) : (
                    alerts.map((alert) => (
                        <TouchableOpacity
                            key={alert.id}
                            onPress={() => markAlertRead(alert.id)}
                            activeOpacity={0.7}
                        >
                            <Card
                                style={[
                                    styles.alertCard,
                                    !alert.read && {
                                        borderLeftColor: theme.colors.primary,
                                        borderLeftWidth: 3,
                                    },
                                ]}
                            >
                                <View style={[styles.alertHeader, isRTL && styles.alertHeaderRTL]}>
                                    <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                                    <View style={[styles.alertContent, isRTL && styles.alertContentRTL]}>
                                        <Text
                                            style={[
                                                styles.alertTitle,
                                                { color: theme.colors.text },
                                                !alert.read && styles.unread,
                                            ]}
                                        >
                                            {alert.title}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.alertMessage,
                                                { color: theme.colors.textSecondary }
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {alert.message}
                                        </Text>
                                    </View>
                                    <Text style={[styles.alertTime, { color: theme.colors.textMuted }]}>
                                        {formatTime(alert.timestamp)}
                                    </Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    headerRTL: {
        flexDirection: 'row-reverse',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    clearButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 16,
    },
    alertCard: {
        marginBottom: 8,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    alertHeaderRTL: {
        flexDirection: 'row-reverse',
    },
    alertIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    alertContent: {
        flex: 1,
    },
    alertContentRTL: {
        alignItems: 'flex-end',
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    unread: {
        fontWeight: '700',
    },
    alertMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    alertTime: {
        fontSize: 11,
        marginLeft: 8,
    },
});

export default AlertsScreen;
