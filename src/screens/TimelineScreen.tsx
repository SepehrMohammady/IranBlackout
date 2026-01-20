import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme, typography, toPersianNumber } from '../theme';
import { TimeSeriesDataPoint } from '../types';
import { iodaClient, ooniClient } from '../services/api';

type TimeRange = '24h' | '7d' | '30d';

const TimelineScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme();
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFarsi = i18n.language === 'fa';
    const screenWidth = Dimensions.get('window').width - 32;

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const now = Math.floor(Date.now() / 1000);
            let from: number;
            let points: number;

            switch (timeRange) {
                case '24h':
                    from = now - 24 * 3600;
                    points = 24;
                    break;
                case '7d':
                    from = now - 7 * 24 * 3600;
                    points = 7;
                    break;
                case '30d':
                    from = now - 30 * 24 * 3600;
                    points = 30;
                    break;
            }

            // Fetch from IODA signals API
            const signals = await iodaClient.getSignals({
                entityType: 'country',
                entityCode: 'IR',
                from,
                until: now,
                datasource: 'bgp',
                maxPoints: points * 2,
            });

            if (signals.length > 0) {
                // Normalize values to 0-100 range
                const maxVal = Math.max(...signals.map(s => s.value));
                const normalized: TimeSeriesDataPoint[] = signals.map((s, i) => ({
                    timestamp: new Date(s.timestamp * 1000).toISOString(),
                    value: maxVal > 0 ? Math.round((s.value / maxVal) * 100) : 0,
                    label: timeRange === '24h'
                        ? `${new Date(s.timestamp * 1000).getHours()}h`
                        : `Day ${i + 1}`,
                }));
                setData(normalized);
            } else {
                // Fallback: try OONI for measurement counts
                const ooniData = await ooniClient.getMeasurements({
                    probe_cc: 'IR',
                    limit: points,
                    since: new Date(from * 1000).toISOString().split('T')[0],
                });

                if (ooniData.results.length > 0) {
                    // Group by day/hour and calculate anomaly rate
                    const grouped = new Map<string, { total: number; anomalies: number }>();
                    ooniData.results.forEach(m => {
                        const key = timeRange === '24h'
                            ? new Date(m.measurement_start_time).getHours().toString()
                            : new Date(m.measurement_start_time).toDateString();
                        const current = grouped.get(key) || { total: 0, anomalies: 0 };
                        current.total++;
                        if (m.anomaly || m.confirmed) current.anomalies++;
                        grouped.set(key, current);
                    });

                    const result: TimeSeriesDataPoint[] = [];
                    grouped.forEach((val, key) => {
                        const connectivity = val.total > 0 ? Math.round(((val.total - val.anomalies) / val.total) * 100) : 50;
                        result.push({
                            timestamp: key,
                            value: connectivity,
                            label: timeRange === '24h' ? `${key}h` : key.slice(4, 10),
                        });
                    });
                    setData(result.slice(0, points));
                } else {
                    setData([]);
                }
            }
        } catch (err) {
            console.error('Failed to fetch timeline data:', err);
            setError('Failed to load data');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const chartData = useMemo(() => {
        if (data.length === 0) return null;
        const labels = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map(d => d.label || '');
        return {
            labels,
            datasets: [{ data: data.map(d => d.value), color: () => colors.primary, strokeWidth: 2 }],
        };
    }, [data, colors.primary]);

    const chartConfig = {
        backgroundColor: 'transparent',
        backgroundGradientFrom: 'transparent',
        backgroundGradientTo: 'transparent',
        decimalPlaces: 0,
        color: (opacity = 1) => isDark ? `rgba(248, 250, 252, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
        labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
        propsForBackgroundLines: { strokeDasharray: '', stroke: colors.border, strokeWidth: 1 },
    };

    const timeRangeOptions: { key: TimeRange; label: string }[] = [
        { key: '24h', label: t('timeline.last24h') },
        { key: '7d', label: t('timeline.last7d') },
        { key: '30d', label: t('timeline.last30d') },
    ];

    const formatNumber = (num: number): string => isFarsi ? toPersianNumber(num) : String(num);

    // Calculate stats
    const avgConnectivity = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length) : 0;
    const minConnectivity = data.length > 0 ? Math.round(Math.min(...data.map(d => d.value))) : 0;
    const outageEvents = data.filter(d => d.value < 50).length;

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[typography.body, { color: colors.textSecondary, marginTop: 16 }]}>
                        {t('timeline.loading')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Title */}
                <Text style={[typography.h2, { color: colors.text, marginBottom: 16 }]}>
                    {t('timeline.title')}
                </Text>

                {/* Time Range Selector */}
                <View style={styles.timeRangeContainer}>
                    {timeRangeOptions.map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.timeRangeButton,
                                { backgroundColor: timeRange === option.key ? colors.primary : colors.surface + 'CC' },
                            ]}
                            onPress={() => setTimeRange(option.key)}
                        >
                            <Text style={[
                                typography.bodySmall,
                                { color: timeRange === option.key ? colors.background : colors.text },
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface + 'CC' }]}>
                        <Text style={[typography.h3, { color: colors.online }]}>
                            {formatNumber(avgConnectivity)}%
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {t('timeline.avgConnectivity')}
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface + 'CC' }]}>
                        <Text style={[typography.h3, { color: colors.limited }]}>
                            {formatNumber(minConnectivity)}%
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {t('timeline.lowestPoint')}
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface + 'CC' }]}>
                        <Text style={[typography.h3, { color: colors.offline }]}>
                            {formatNumber(outageEvents)}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {t('timeline.disruptions')}
                        </Text>
                    </View>
                </View>

                {/* Chart */}
                {chartData && data.length > 1 ? (
                    <View style={[styles.chartContainer, { backgroundColor: colors.surface + 'CC' }]}>
                        <Text style={[typography.h4, { color: colors.text, marginBottom: 16 }]}>
                            {t('timeline.connectivityOverTime')}
                        </Text>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 32}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                            withInnerLines
                            withOuterLines={false}
                            fromZero
                            yAxisSuffix="%"
                        />
                    </View>
                ) : (
                    <View style={[styles.noDataContainer, { backgroundColor: colors.surface + 'CC' }]}>
                        <Icon name="chart-line" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
                        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 16 }]}>
                            {error || t('timeline.noData')}
                        </Text>
                    </View>
                )}

                {/* Data Source Attribution */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface + 'CC' }]}>
                    <Icon name="chart-bar" size={18} color={colors.primary} />
                    <Text style={[typography.bodySmall, { color: colors.textSecondary, flex: 1, marginLeft: 8 }]}>
                        {t('timeline.dataAttribution')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    timeRangeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    timeRangeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    statsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
    chartContainer: { padding: 16, borderRadius: 16, marginBottom: 16 },
    chart: { borderRadius: 16, marginLeft: -16 },
    noDataContainer: { padding: 40, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
    infoCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 16 },
});

export default TimelineScreen;
