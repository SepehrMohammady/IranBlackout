import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, typography } from '../theme';
import { provinces } from '../components/IranMap';
import IranMap from '../components/IranMap';
import ISPStatusCard from '../components/ISPStatusCard';
import { ISP, Region, ConnectivityStatus, OONIMeasurement } from '../types';
import { ooniClient, cloudflareClient } from '../services/api';
import { cache } from '../services/cache';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Iranian ISPs and their ASN mappings (from Cloudflare Radar)
const ISP_MAPPING: Record<string, { nameEn: string; nameFa: string; type: 'mobile' | 'fixed' | 'both' }> = {
    // Mobile Operators
    'AS44244': { nameEn: 'Irancell', nameFa: 'ایرانسل', type: 'mobile' },
    'AS197207': { nameEn: 'MCI (Hamrah-e-Aval)', nameFa: 'همراه اول', type: 'mobile' },
    'AS57218': { nameEn: 'Rightel', nameFa: 'رایتل', type: 'mobile' },
    'AS56548': { nameEn: 'Negintel', nameFa: 'نگین تل', type: 'mobile' },
    // Fixed-line ISPs
    'AS58224': { nameEn: 'TCI (Mokhaberat)', nameFa: 'مخابرات', type: 'fixed' },
    'AS31549': { nameEn: 'Shatel', nameFa: 'شاتل', type: 'fixed' },
    'AS43754': { nameEn: 'Asiatech', nameFa: 'آسیاتک', type: 'fixed' },
    'AS16322': { nameEn: 'ParsOnline', nameFa: 'پارس آنلاین', type: 'fixed' },
    'AS25124': { nameEn: 'Afranet', nameFa: 'افرانت', type: 'fixed' },
    'AS42337': { nameEn: 'Respina', nameFa: 'رسپینا', type: 'fixed' },
    'AS12880': { nameEn: 'DCI (Iran Telecom)', nameFa: 'ارتباطات داده', type: 'fixed' },
    'AS49100': { nameEn: 'Pishgaman', nameFa: 'پیشگامان', type: 'fixed' },
    'AS205647': { nameEn: 'AFAGH', nameFa: 'آفاق', type: 'fixed' },
    // Both (mixed providers)
    'AS41881': { nameEn: 'Fanava', nameFa: 'فناوا', type: 'both' },
    'AS48159': { nameEn: 'TIC', nameFa: 'زیرساخت', type: 'both' },
    'AS49666': { nameEn: 'Iran Telecom', nameFa: 'مخابرات ایران', type: 'both' },
};

// Generate regions from map data
const REGION_DATA: Region[] = Object.entries(provinces).map(([id, data]) => ({
    id,
    nameEn: data.name,
    nameFa: data.name, // Will be replaced by translation if available
    status: 'unknown',
    lastUpdated: ''
}));

const HomeScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme(); // Removed isRTL as it's not directly exposed by useTheme typically, using i18n.language instead
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [regions, setRegions] = useState<Region[]>(REGION_DATA);
    const [isps, setIsps] = useState<ISP[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [measurementCount, setMeasurementCount] = useState(0);
    const [trafficChange, setTrafficChange] = useState<number | null>(null); // Cloudflare traffic change %

    const isFarsi = i18n.language === 'fa';

    // Calculate ISP status from OONI measurements
    const calculateISPStatus = (measurements: OONIMeasurement[]): ISP[] => {
        const ispStats: Record<string, { total: number; anomalies: number; confirmed: number }> = {};

        measurements.forEach(m => {
            const asn = `AS${m.probe_asn}`;
            if (!ispStats[asn]) {
                ispStats[asn] = { total: 0, anomalies: 0, confirmed: 0 };
            }
            ispStats[asn].total++;
            if (m.anomaly) ispStats[asn].anomalies++;
            if (m.confirmed) ispStats[asn].confirmed++;
        });

        const result: ISP[] = [];
        Object.entries(ISP_MAPPING).forEach(([asn, info]) => {
            const stats = ispStats[asn] || { total: 0, anomalies: 0, confirmed: 0 };
            let status: ConnectivityStatus = 'online';

            if (stats.total > 0) {
                const anomalyRate = (stats.anomalies + stats.confirmed) / stats.total;
                if (anomalyRate > 0.5) status = 'offline';
                else if (anomalyRate > 0.2) status = 'limited';
            } else {
                status = 'unknown';
            }

            result.push({
                id: asn,
                nameEn: info.nameEn,
                nameFa: info.nameFa,
                type: info.type,
                status,
                lastUpdated: new Date().toISOString(),
            });
        });

        return result;
    };

    // Update region statuses based on ISP data
    const updateRegionStatus = (ispData: ISP[]): Region[] => {
        const offlineCount = ispData.filter(i => i.status === 'offline').length;
        const limitedCount = ispData.filter(i => i.status === 'limited').length;

        let overallStatus: ConnectivityStatus = 'online';
        if (offlineCount > ispData.length / 2) overallStatus = 'offline';
        else if (limitedCount > ispData.length / 3 || offlineCount > 0) overallStatus = 'limited';

        return REGION_DATA.map(r => ({
            ...r,
            status: overallStatus,
            lastUpdated: new Date().toISOString(),
        }));
    };

    const fetchData = useCallback(async (forceRefresh = false) => {
        try {
            setError(null);

            if (!forceRefresh) {
                const cachedData = await cache.get<{ isps: ISP[]; regions: Region[]; anomalies: number; measurements: number }>('home_data');
                if (cachedData) {
                    setIsps(cachedData.isps);
                    setRegions(cachedData.regions);
                    setAnomalyCount(cachedData.anomalies);
                    setMeasurementCount(cachedData.measurements);
                    setLastUpdated(await cache.getLastUpdated('home_data'));
                    setLoading(false);
                    return;
                }
            }

            // Fetch Cloudflare traffic data first to detect major outages
            let majorOutage = false;
            try {
                const cfData = await cloudflareClient.getTrafficAnomalies('IR');
                if (cfData.length > 0) {
                    // Get the most recent traffic change
                    const latestChange = cfData[0].trafficChange;
                    setTrafficChange(latestChange);
                    // If traffic dropped by 50% or more, it's a major outage
                    if (latestChange <= -50) {
                        majorOutage = true;
                    }
                }
            } catch (cfError) {
                console.warn('Cloudflare data unavailable:', cfError);
            }

            const response = await ooniClient.getMeasurements({
                probe_cc: 'IR',
                limit: 200,
                since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });

            const measurements = response.results;
            const anomalies = measurements.filter(m => m.anomaly || m.confirmed);

            setMeasurementCount(measurements.length);
            setAnomalyCount(anomalies.length);

            let ispData = calculateISPStatus(measurements);

            // Override all statuses if major outage detected via Cloudflare
            if (majorOutage) {
                ispData = ispData.map(isp => ({
                    ...isp,
                    status: 'offline' as ConnectivityStatus,
                }));
            }
            setIsps(ispData);

            let regionData = updateRegionStatus(ispData);
            // Override regions too if major outage
            if (majorOutage) {
                regionData = regionData.map(r => ({
                    ...r,
                    status: 'offline' as ConnectivityStatus,
                }));
            }
            setRegions(regionData);

            setLastUpdated(new Date());

            await cache.set('home_data', {
                isps: ispData,
                regions: regionData,
                anomalies: anomalies.length,
                measurements: measurements.length,
            }, 5 * 60 * 1000);

        } catch (err) {
            console.error('Failed to fetch OONI data:', err);
            setError(t('errors.fetchFailed'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData(true);
        setRefreshing(false);
    }, [fetchData]);

    const formatTime = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleTimeString(isFarsi ? 'fa-IR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const overall = (() => {
        if (regions.some(r => r.status === 'offline')) return { text: t('status.disrupted'), color: colors.offline };
        if (regions.some(r => r.status === 'limited')) return { text: t('status.limited'), color: colors.limited };
        if (trafficChange && trafficChange < -0.3) return { text: t('status.disrupted'), color: colors.offline };
        return { text: t('status.normal'), color: colors.online };
    })();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#FFFFFF" />
                }
            >
                {/* Header */}
                <View style={[styles.header, isFarsi && styles.headerRTL]}>
                    <Text style={[typography.h1, styles.appName, { color: '#FFFFFF' }]}>
                        {t('home.title')}
                    </Text>
                    <Text style={[typography.body, styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>
                        {t('home.subtitle')}
                    </Text>
                </View>

                {/* Compact Stats Bar */}
                <View style={[styles.compactStats, { backgroundColor: colors.surface + 'CC', borderColor: colors.border }]}>
                    <View style={styles.compactStatItem}>
                        <View style={[styles.statusDot, { backgroundColor: overall.color }]} />
                        <Text style={[typography.bodySmall, { color: colors.text }]}>
                            {t('home.statusLine', { status: overall.text, time: '' }).split('-')[0]}
                        </Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.compactStatItem}>
                        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                            {t('home.measurements')}: <Text style={{ color: colors.text, fontWeight: '600' }}>{measurementCount}</Text>
                        </Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.compactStatItem}>
                        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                            {t('home.anomalies')}: <Text style={{ color: colors.offline, fontWeight: '600' }}>{anomalyCount}</Text>
                        </Text>
                    </View>
                </View>

                {error && (
                    <View style={[styles.errorCard, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                        <Text style={{ color: '#FCA5A5', textAlign: 'center' }}>{error}</Text>
                    </View>
                )}

                {/* Map Section */}
                <View style={styles.section}>
                    <Text style={[typography.h3, styles.sectionTitle, { color: '#FFFFFF' }]}>
                        {t('home.mapTitle')}
                    </Text>
                    <View style={[styles.mapContainer, { backgroundColor: 'rgba(30, 41, 59, 0.5)' }]}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />
                        ) : (
                            <IranMap regions={regions} />
                        )}
                    </View>
                </View>

                {/* ISP Status List */}
                <View style={styles.section}>
                    <Text style={[typography.h3, styles.sectionTitle, { color: '#FFFFFF' }]}>
                        {t('home.ispTitle')}
                    </Text>
                    <View style={styles.ispList}>
                        {isps.map((isp) => (
                            <ISPStatusCard key={isp.id} isp={isp} isFarsi={isFarsi} />
                        ))}
                    </View>
                </View>

                <View style={[styles.footer, { marginBottom: 80 }]}>
                    <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', textAlign: 'center' }]}>
                        {t('home.dataSource')}
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
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    headerRTL: {
        alignItems: 'flex-end',
    },
    appName: {
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 8,
    },
    statsCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 24,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    lastUpdated: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    errorCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    mapContainer: {
        borderRadius: 16,
        padding: 16,
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ispList: {
        gap: 12,
    },
    footer: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    compactStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
    },
    compactStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    divider: {
        width: 1,
        height: 16,
        opacity: 0.2,
    },
});

export default HomeScreen;
