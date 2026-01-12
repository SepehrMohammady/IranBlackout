import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

import { useTheme, typography, toPersianNumber } from '../theme';
import { TimeSeriesDataPoint } from '../types';

type TimeRange = '24h' | '7d' | '30d';

// Mock time series data
const generateMockData = (range: TimeRange): TimeSeriesDataPoint[] => {
    const points = range === '24h' ? 24 : range === '7d' ? 7 : 30;
    const data: TimeSeriesDataPoint[] = [];

    for (let i = 0; i < points; i++) {
        const baseValue = 70 + Math.random() * 20;
        const dip = Math.random() > 0.85 ? Math.random() * 40 : 0;
        data.push({
            timestamp: new Date(Date.now() - i * (range === '24h' ? 3600000 : 86400000)).toISOString(),
            value: Math.max(0, Math.min(100, baseValue - dip)),
            label: range === '24h' ? `${23 - i}:00` : `Day ${points - i}`,
        });
    }

    return data.reverse();
};

const TimelineScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme();
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [data] = useState(() => generateMockData(timeRange));

    const isFarsi = i18n.language === 'fa';
    const screenWidth = Dimensions.get('window').width - 32;

    const chartData = {
        labels: data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map(d => d.label || ''),
        datasets: [
            {
                data: data.map(d => d.value),
                color: (opacity = 1) => `rgba(30, 58, 95, ${opacity})`, // Primary color
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: colors.surface,
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => isDark ? `rgba(248, 250, 252, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
        labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
        },
    };

    const timeRangeOptions: { key: TimeRange; label: string }[] = [
        { key: '24h', label: t('timeline.last24h') },
        { key: '7d', label: t('timeline.last7d') },
        { key: '30d', label: t('timeline.last30d') },
    ];

    const formatNumber = (num: number): string => {
        return isFarsi ? toPersianNumber(num) : String(num);
    };

    // Calculate average connectivity
    const avgConnectivity = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
    const minConnectivity = Math.round(Math.min(...data.map(d => d.value)));
    const outageEvents = data.filter(d => d.value < 50).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[typography.h2, { color: colors.text }]}>
                        {t('timeline.title')}
                    </Text>
                </View>

                {/* Time Range Selector */}
                <View style={styles.timeRangeContainer}>
                    {timeRangeOptions.map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.timeRangeButton,
                                {
                                    backgroundColor: timeRange === option.key ? colors.primary : colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => setTimeRange(option.key)}
                        >
                            <Text
                                style={[
                                    typography.bodySmall,
                                    {
                                        color: timeRange === option.key ? '#FFFFFF' : colors.text,
                                        fontWeight: timeRange === option.key ? '600' : '400',
                                    },
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[typography.h2, { color: colors.online }]}>
                            {formatNumber(avgConnectivity)}%
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            Avg. Connectivity
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[typography.h2, { color: colors.offline }]}>
                            {formatNumber(minConnectivity)}%
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            Lowest Point
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[typography.h2, { color: colors.limited }]}>
                            {formatNumber(outageEvents)}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            Disruptions
                        </Text>
                    </View>
                </View>

                {/* Line Chart */}
                <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[typography.h4, styles.chartTitle, { color: colors.text }]}>
                        Connectivity Over Time
                    </Text>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={true}
                        withOuterLines={false}
                        withVerticalLabels={true}
                        withHorizontalLabels={true}
                        fromZero={true}
                        yAxisSuffix="%"
                    />
                </View>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.surfaceVariant }]}>
                    <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                        📊 Data aggregated from OONI, Cloudflare Radar, and crowdsourced reports.
                        All times shown in local timezone.
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
        marginBottom: 16,
    },
    timeRangeContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    timeRangeButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    chartContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    chartTitle: {
        marginBottom: 12,
    },
    chart: {
        borderRadius: 12,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
    },
});

export default TimelineScreen;
