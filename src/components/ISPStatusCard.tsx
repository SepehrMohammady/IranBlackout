import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme, typography } from '../theme';
import { ISP, ConnectivityStatus } from '../types';
import StatusIndicator from './StatusIndicator';

interface ISPStatusCardProps {
    isp: ISP;
    isFarsi?: boolean;
}

const ISPStatusCard: React.FC<ISPStatusCardProps> = ({ isp, isFarsi = false }) => {
    const { t } = useTranslation();
    const { colors, isRTL } = useTheme();

    const getTypeLabel = (type: ISP['type']): string => {
        switch (type) {
            case 'mobile': return '📱';
            case 'fixed': return '🌐';
            case 'both': return '📡';
            default: return '';
        }
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return t('common.justNow');
        if (diffMins < 60) return t('common.minutesAgo', { count: diffMins });
        if (diffHours < 24) return t('common.hoursAgo', { count: diffHours });
        if (diffDays === 1) return t('common.yesterday');
        return t('common.daysAgo', { count: diffDays });
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }, isRTL && styles.cardRTL]}>
            <View style={[styles.leftSection, isRTL && styles.leftSectionRTL]}>
                <Text style={styles.typeIcon}>{getTypeLabel(isp.type)}</Text>
                <View style={styles.nameContainer}>
                    <Text style={[typography.body, styles.name, { color: colors.text }]} numberOfLines={1}>
                        {isFarsi ? isp.nameFa : isp.nameEn}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {formatTime(isp.lastUpdated)}
                    </Text>
                </View>
            </View>

            <StatusIndicator status={isp.status} showLabel />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    cardRTL: {
        flexDirection: 'row-reverse',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    leftSectionRTL: {
        flexDirection: 'row-reverse',
    },
    typeIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontWeight: '500',
        marginBottom: 2,
    },
});

export default ISPStatusCard;
