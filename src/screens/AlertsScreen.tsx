import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, typography } from '../theme';
import { Alert } from '../types';

// Mock alerts data
const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'outage',
        title: 'Major Outage Detected',
        message: 'Significant connectivity disruption reported in Mashhad region affecting multiple ISPs.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        regionId: 'mashhad',
    },
    {
        id: '2',
        type: 'partial',
        title: 'Partial Connectivity Issues',
        message: 'Irancell experiencing limited connectivity in Tehran. Users report slow speeds and intermittent connections.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        ispId: 'irancell',
    },
    {
        id: '3',
        type: 'restoration',
        title: 'Connectivity Restored',
        message: 'Internet access has been restored in Isfahan after 4-hour disruption.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        read: true,
        regionId: 'isfahan',
    },
    {
        id: '4',
        type: 'info',
        title: 'Monitoring Update',
        message: 'New OONI probe data available. Coverage expanded to 5 additional cities.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
    },
    {
        id: '5',
        type: 'outage',
        title: 'Shatel Network Down',
        message: 'Shatel fixed-line service experiencing nationwide outage. No estimated restoration time.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        ispId: 'shatel',
    },
];

const AlertsScreen: React.FC = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

    const getAlertIcon = (type: Alert['type']): string => {
        switch (type) {
            case 'outage': return '🔴';
            case 'partial': return '🟡';
            case 'restoration': return '🟢';
            case 'info': return 'ℹ️';
            default: return '●';
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
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
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

    const renderAlert = ({ item }: { item: Alert }) => (
        <TouchableOpacity
            style={[
                styles.alertCard,
                {
                    backgroundColor: colors.surface,
                    borderLeftColor: getAlertColor(item.type),
                    opacity: item.read ? 0.7 : 1,
                },
            ]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.alertHeader}>
                <View style={styles.alertTitleRow}>
                    <Text style={styles.alertIcon}>{getAlertIcon(item.type)}</Text>
                    <Text style={[typography.h4, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                        {item.title}
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
                {item.message}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[typography.h2, { color: colors.text }]}>
                        {t('alerts.title')}
                    </Text>
                    {unreadCount > 0 && (
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {unreadCount} unread
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

            {/* Alerts List */}
            <FlatList
                data={alerts}
                renderItem={renderAlert}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={[typography.body, { color: colors.textSecondary }]}>
                            {t('alerts.noAlerts')}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 8,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
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
        fontSize: 16,
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
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
});

export default AlertsScreen;
