// Iran Blackout - Timeline Screen

import React, { useEffect, useState } from 'react';
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
import { fetchTimeline } from '../services/api';
import { Card, StatusDot } from '../components';
import { formatNumber } from '../i18n';
import { TimelineDataPoint } from '../types';

type TimeRange = '24h' | '7d' | '30d';

const TimelineScreen: React.FC = () => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'fa';

    const [timeRange, setTimeRange] = useState<TimeRange>('24h');
    const [data, setData] = useState<TimelineDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const { outages } = useAppStore();

    useEffect(() => {
        const loadTimeline = async () => {
            setLoading(true);
            const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
            const result = await fetchTimeline(days);
            setData(result);
            setLoading(false);
        };

        loadTimeline();
    }, [timeRange]);

    // Calculate average connectivity
    const avgConnectivity = data.length > 0
        ? data.reduce((sum, p) => sum + p.value, 0) / data.length
        : 0;

    const getTimeRangeDays = () => {
        switch (timeRange) {
            case '24h': return 1;
            case '7d': return 7;
            case '30d': return 30;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {t('timeline.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {t('timeline.subtitle')}
                    </Text>
                </View>

                {/* Time range selector */}
                <View style={styles.rangeSelector}>
                    {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
                        <TouchableOpacity
                            key={range}
                            style={[
                                styles.rangeButton,
                                {
                                    backgroundColor: timeRange === range
                                        ? theme.colors.primary
                                        : theme.colors.surface,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            onPress={() => setTimeRange(range)}
                        >
                            <Text
                                style={[
                                    styles.rangeButtonText,
                                    {
                                        color: timeRange === range
                                            ? '#FFFFFF'
                                            : theme.colors.text,
                                    },
                                ]}
                            >
                                {t(`timeline.past_${range}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats summary */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {formatNumber(Math.round(avgConnectivity))}%
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Avg. Connectivity
                        </Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.offline }]}>
                            {formatNumber(outages.length)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            {t('timeline.total_outages')}
                        </Text>
                    </Card>
                </View>

                {/* Chart placeholder */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
                        Connectivity Over Time
                    </Text>

                    {/* Simple bar chart visualization */}
                    <View style={styles.chart}>
                        {data.slice(-24).map((point, index) => {
                            const barColor = point.status === 'online'
                                ? theme.colors.online
                                : point.status === 'limited'
                                    ? theme.colors.limited
                                    : theme.colors.offline;

                            return (
                                <View key={index} style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${point.value}%`,
                                                backgroundColor: barColor,
                                            }
                                        ]}
                                    />
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.chartLabels}>
                        <Text style={[styles.chartLabel, { color: theme.colors.textMuted }]}>
                            {getTimeRangeDays()} {getTimeRangeDays() === 1 ? 'day' : 'days'} ago
                        </Text>
                        <Text style={[styles.chartLabel, { color: theme.colors.textMuted }]}>
                            Now
                        </Text>
                    </View>
                </Card>

                {/* Recent events */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Recent Events
                    </Text>

                    {outages.length === 0 ? (
                        <Card>
                            <Text style={[styles.noData, { color: theme.colors.textMuted }]}>
                                {t('timeline.no_outages')}
                            </Text>
                        </Card>
                    ) : (
                        outages.slice(0, 10).map((outage) => (
                            <Card key={outage.id} style={styles.eventCard}>
                                <View style={styles.eventHeader}>
                                    <StatusDot status={outage.status} size={10} />
                                    <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                                        {outage.provinceId || 'Nationwide'} - {outage.severity}
                                    </Text>
                                </View>
                                <Text style={[styles.eventTime, { color: theme.colors.textSecondary }]}>
                                    {new Date(outage.startTime).toLocaleString(isRTL ? 'fa-IR' : 'en-US')}
                                </Text>
                            </Card>
                        ))
                    )}
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
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    rangeSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    rangeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    rangeButtonText: {
        fontWeight: '600',
        fontSize: 14,
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
        fontSize: 28,
        fontWeight: '900',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    chartCard: {
        marginBottom: 20,
        padding: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    chart: {
        flexDirection: 'row',
        height: 120,
        alignItems: 'flex-end',
        gap: 2,
    },
    barContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 2,
        minHeight: 4,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    chartLabel: {
        fontSize: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    noData: {
        textAlign: 'center',
        paddingVertical: 20,
    },
    eventCard: {
        marginBottom: 8,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    eventTime: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 18,
    },
});

export default TimelineScreen;
