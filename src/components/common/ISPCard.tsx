// Iran Blackout - ISP Status Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { ISP } from '../../types';
import { StatusDot } from './StatusBadge';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../../i18n';

interface ISPCardProps {
    isp: ISP;
    onPress?: (isp: ISP) => void;
}

export const ISPCard: React.FC<ISPCardProps> = ({ isp, onPress }) => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'fa';

    const typeLabel = isp.type === 'mobile' ? '📱' : isp.type === 'fixed' ? '🌐' : '📡';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}
            onPress={() => onPress?.(isp)}
            activeOpacity={0.7}
        >
            <View style={[styles.content, isRTL && styles.contentRTL]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.typeIcon}>{typeLabel}</Text>
                </View>

                <View style={[styles.info, isRTL && styles.infoRTL]}>
                    <Text
                        style={[
                            styles.name,
                            { color: theme.colors.text },
                            isRTL && styles.textRTL
                        ]}
                        numberOfLines={1}
                    >
                        {isRTL ? isp.nameFa : isp.nameEn}
                    </Text>

                    <Text
                        style={[
                            styles.subtitle,
                            { color: theme.colors.textSecondary },
                            isRTL && styles.textRTL
                        ]}
                    >
                        {isp.type === 'mobile' ? t('isps.mobile') : t('isps.fixed')}
                    </Text>
                </View>

                <View style={styles.statusContainer}>
                    <StatusDot status={isp.status} size={12} />
                    <Text
                        style={[
                            styles.statusLabel,
                            {
                                color: isp.status === 'online'
                                    ? theme.colors.online
                                    : isp.status === 'limited'
                                        ? theme.colors.limited
                                        : theme.colors.offline
                            }
                        ]}
                    >
                        {t(`status.${isp.status}`)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Compact ISP list for dashboard
interface ISPListProps {
    isps: ISP[];
    onPressISP?: (isp: ISP) => void;
}

export const ISPList: React.FC<ISPListProps> = ({ isps, onPressISP }) => {
    return (
        <View style={styles.list}>
            {isps.map((isp) => (
                <ISPCard key={isp.id} isp={isp} onPress={onPressISP} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    contentRTL: {
        flexDirection: 'row-reverse',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeIcon: {
        fontSize: 20,
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    infoRTL: {
        marginLeft: 0,
        marginRight: 12,
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
    },
    textRTL: {
        textAlign: 'right',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    list: {
        gap: 8,
    },
});

export default ISPCard;
