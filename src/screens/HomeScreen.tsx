// Iran Blackout - Home/Dashboard Screen

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar,
    SafeAreaView,
    Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useAppStore } from '../store';
import { fetchIranConnectivity, fetchISPStatus } from '../services/api';
import { Card, StatusBadge, ISPList } from '../components';
import { formatNumber } from '../i18n';

const HomeScreen: React.FC = () => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'fa';

    const [refreshing, setRefreshing] = useState(false);

    // Store state
    const {
        provinces,
        isps,
        stats,
        isLoading,
        isOffline,
        lastFetch,
        setProvinces,
        setISPs,
        setStats,
        setLoading,
        setLastFetch,
        setError,
    } = useAppStore();

    // Fetch data
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [connectivityData, ispData] = await Promise.all([
                fetchIranConnectivity(),
                fetchISPStatus(),
            ]);

            setProvinces(connectivityData.provinces);
            setStats(connectivityData.stats);
            setISPs(ispData);
            setLastFetch(new Date());
            setError(null);
        } catch (error) {
            setError('Failed to fetch data');
            console.error('Data fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [setProvinces, setISPs, setStats, setLoading, setLastFetch, setError]);

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    // Calculate stats
    const onlineCount = provinces.filter((p) => p.status === 'online').length;
    const outageCount = provinces.filter((p) => p.status === 'offline').length;
    const limitedCount = provinces.filter((p) => p.status === 'limited').length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {/* Header */}
                <View style={[styles.header, isRTL && styles.headerRTL]}>
                    <View style={styles.logoContainer}>
                        <Text style={[styles.appName, { color: theme.colors.text }]}>
                            {t('app_name')}
                        </Text>
                        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
                            ✊ {isRTL ? 'زن، زندگی، آزادی' : 'Woman, Life, Freedom'}
                        </Text>
                    </View>

                    {/* Overall status */}
                    {stats && (
                        <StatusBadge
                            status={stats.overallStatus}
                            size="large"
                        />
                    )}
                </View>

                {/* Offline banner */}
                {isOffline && (
                    <View style={[styles.offlineBanner, { backgroundColor: theme.colors.warning + '20' }]}>
                        <Text style={[styles.offlineText, { color: theme.colors.warning }]}>
                            ⚠️ {t('common.cached_data')}
                        </Text>
                    </View>
                )}

                {/* Stats cards */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.online }]}>
                            {formatNumber(onlineCount)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            {t('status.online')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.limited }]}>
                            {formatNumber(limitedCount)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            {t('status.limited')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.offline }]}>
                            {formatNumber(outageCount)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            {t('status.offline')}
                        </Text>
                    </Card>
                </View>

                {/* Map placeholder - will be SVG map */}
                <Card style={styles.mapCard}>
                    <View style={styles.mapContainer}>
                        <Text style={[styles.mapPlaceholder, { color: theme.colors.textMuted }]}>
                            🗺️ {t('dashboard.tap_region')}
                        </Text>
                        {/* Iran SVG Map will be rendered here */}
                        <View style={styles.mapLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.online }]} />
                                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                    {t('status.online')}
                                </Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.limited }]} />
                                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                    {t('status.limited')}
                                </Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.offline }]} />
                                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                    {t('status.offline')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* ISP Status Section */}
                <View style={styles.section}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: theme.colors.text },
                        isRTL && styles.textRTL
                    ]}>
                        {t('dashboard.isp_status')}
                    </Text>

                    <ISPList isps={isps} />
                </View>

                {/* Last updated */}
                {lastFetch && (
                    <Text style={[styles.lastUpdated, { color: theme.colors.textMuted }]}>
                        {t('dashboard.last_updated')}: {lastFetch.toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US')}
                    </Text>
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
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerRTL: {
        flexDirection: 'row-reverse',
    },
    logoContainer: {
        flex: 1,
    },
    appName: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 14,
        marginTop: 4,
    },
    offlineBanner: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    offlineText: {
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    mapCard: {
        marginBottom: 20,
        padding: 0,
        overflow: 'hidden',
    },
    mapContainer: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    mapPlaceholder: {
        fontSize: 16,
    },
    mapLegend: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    textRTL: {
        textAlign: 'right',
    },
    lastUpdated: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 8,
    },
});

export default HomeScreen;
