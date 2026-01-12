import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme, typography } from '../theme';
import { ConnectivityStatus } from '../types';

interface StatusIndicatorProps {
    status: ConnectivityStatus;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    status,
    size = 'medium',
    showLabel = false
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const getStatusColor = (): string => {
        switch (status) {
            case 'online': return colors.online;
            case 'limited': return colors.limited;
            case 'offline': return colors.offline;
            default: return colors.unknown;
        }
    };

    const getStatusLabel = (): string => {
        return t(`status.${status}`);
    };

    const getDotSize = (): number => {
        switch (size) {
            case 'small': return 8;
            case 'large': return 16;
            default: return 12;
        }
    };

    const dotSize = getDotSize();
    const statusColor = getStatusColor();

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: statusColor,
                    }
                ]}
            />
            {/* Pulse animation for offline status */}
            {status === 'offline' && (
                <View
                    style={[
                        styles.pulse,
                        {
                            width: dotSize * 2,
                            height: dotSize * 2,
                            borderRadius: dotSize,
                            backgroundColor: statusColor,
                        }
                    ]}
                />
            )}
            {showLabel && (
                <Text style={[typography.bodySmall, styles.label, { color: statusColor }]}>
                    {getStatusLabel()}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        zIndex: 2,
    },
    pulse: {
        position: 'absolute',
        left: 0,
        opacity: 0.3,
        zIndex: 1,
    },
    label: {
        fontWeight: '500',
    },
});

export default StatusIndicator;
