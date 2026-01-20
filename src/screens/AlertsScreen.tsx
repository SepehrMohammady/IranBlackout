import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme, typography } from '../theme';
import { Alert } from '../types';
import { iodaClient } from '../services/api';

const AlertsScreen: React.FC = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setError(null);
            // Fetch from IODA API - real outage data
            const iodaAlerts = await iodaClient.getOutageAlerts({
                entityType: 'country',
                entityCode: 'IR',
                from: Math.floor(Date.now() / 1000) - 7 * 24 * 3600, // Last 7 days
                until: Math.floor(Date.now() / 1000),
                limit: 30,
            });

            if (iodaAlerts.length > 0) {
                setAlerts(iodaAlerts);
            } else {
                // No alerts means stable connectivity - show empty state
                setAlerts([]);
            }
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
            setError('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAlerts();
        setRefreshing(false);
    }, [fetchAlerts]);

    const getAlertIcon = (type: Alert['type']): string => {
        switch (type) {
            case 'outage': return 'alert-circle';
            case 'partial': return 'alert';
            case 'restoration': return 'check-circle';
            case 'info': return 'information';
            default: return 'circle';
        }
    };

    const getAlertColor = (type: Alert['type']): string => {
        switch (type) {
            case 'outage': return colors.offline;
            case 'partial': return colors.limited;
            case 'restoration': return colors.online;
            case 'info': return colors.primary;
            default: return colors.textSecondary;
        }
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('alerts.justNow');
        if (diffMins < 60) return t('common.minutesAgo', { count: diffMins });
        if (diffHours < 24) return t('common.hoursAgo', { count: diffHours });
        if (diffDays === 1) return t('alerts.yesterday');
        return t('common.daysAgo', { count: diffDays });
    };

    const markAsRead = (id: string) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === id ? { ...alert, read: true } : alert
            )
        );
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    };

    const unreadCount = alerts.filter(a => !a.read).length;

    const renderAlert = ({ item }: { item: Alert }) => {
        // Parse title and message if they are JSON strings
        let title = item.title;
        let message = item.message;

        try {
            const titleObj = JSON.parse(item.title);
            if (titleObj && titleObj.type) {
                const entityName = titleObj.entityName || 'Iran';
                switch (titleObj.type) {
                    case 'outage':
                        title = `${t('alerts.majorOutage')}: ${entityName}`;
                        break;
                    case 'partial':
                        title = `${t('alerts.connectivityIssues')}: ${entityName}`;
                        break;
                    case 'restoration':
                        title = `${t('alerts.connectivityRestored')}: ${entityName}`;
                        break;
                    default:
                        title = `${t('alerts.networkUpdate')}: ${entityName}`;
                }
            }
        } catch (e) {
            // Not JSON, use as is
        }

        try {
            const msgObj = JSON.parse(item.message);
            if (msgObj && msgObj.key) {
                message = t(`alerts.${msgObj.key}`);
            }
        } catch (e) {
            // Not JSON, use as is
        }

        return (
            <TouchableOpacity
                style={[
                    styles.alertCard,
                    {
                        backgroundColor: item.read ? colors.surface + 'E6' : colors.surfaceVariant + 'E6',
                        borderColor: getAlertColor(item.type),
                    },
                ]}
                onPress={() => markAsRead(item.id)}
            >
                <View style={styles.alertHeader}>
                    <View style={styles.alertTitleRow}>
                        <Icon
                            name={getAlertIcon(item.type)}
                            size={20}
                            color={getAlertColor(item.type)}
                            style={styles.alertIcon}
                        />
                        <Text style={[typography.h4, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                            {title}
                        </Text>
                        {!item.read && (
                            <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                        )}
                    </View>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
                <Text style={[typography.body, styles.alertMessage, { color: colors.textSecondary }]} numberOfLines={3}>
                    {message}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[typography.body, { color: colors.textSecondary, marginTop: 16 }]}>
                        {t('alerts.loading')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[typography.h2, { color: colors.text }]}>
                        {t('alerts.title')}
                    </Text>
                    {unreadCount > 0 && (
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {unreadCount} {t('alerts.unread')}
                        </Text>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={[typography.bodySmall, { color: colors.primary }]}>
                            {t('alerts.markAllRead')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Error Message */}
            {error && (
                <View style={[styles.errorBanner, { backgroundColor: colors.offline + '20' }]}>
                    <Icon name="alert-circle-outline" size={18} color={colors.offline} />
                    <Text style={[typography.bodySmall, { color: colors.offline, marginLeft: 8 }]}>
                        {error}
                    </Text>
                </View>
            )}

            {/* Alerts List */}
            <FlatList
                data={alerts}
                renderItem={renderAlert}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Icon name="bell-check-outline" size={48} color={colors.online} style={{ opacity: 0.5 }} />
                        <Text style={[typography.h4, { color: colors.text, marginTop: 16 }]}>
                            {t('alerts.noAlerts')}
                        </Text>
                        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
                            {t('alerts.noAlertsDesc')}
                        </Text>
                    </View>
                }
            />

            {/* Data Source Attribution */}
            <View style={styles.attribution}>
                <Icon name="database" size={14} color={colors.textSecondary} />
                <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
                    Data from IODA (Georgia Tech)
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 8,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 80,
    },
    alertCard: {
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    alertTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    alertIcon: {
        marginRight: 4,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    alertMessage: {
        lineHeight: 22,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    attribution: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingBottom: 80,
    },
});

export default AlertsScreen;
