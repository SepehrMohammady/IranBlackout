// Iran Blackout - Status Badge Component

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { ConnectivityStatus } from '../../types';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
    status: ConnectivityStatus;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    size = 'medium',
    showLabel = true,
    style,
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return theme.colors.online;
            case 'limited':
                return theme.colors.limited;
            case 'offline':
                return theme.colors.offline;
            default:
                return theme.colors.textMuted;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { dot: 8, fontSize: 10, padding: 4 };
            case 'large':
                return { dot: 14, fontSize: 16, padding: 10 };
            default:
                return { dot: 10, fontSize: 12, padding: 6 };
        }
    };

    const color = getStatusColor();
    const sizes = getSizeStyles();

    return (
        <View style={[styles.container, { paddingHorizontal: sizes.padding }, style]}>
            {/* Pulsing dot for online status */}
            <View style={styles.dotContainer}>
                <View
                    style={[
                        styles.dot,
                        {
                            width: sizes.dot,
                            height: sizes.dot,
                            backgroundColor: color,
                            borderRadius: sizes.dot / 2,
                        }
                    ]}
                />
                {status === 'online' && (
                    <View
                        style={[
                            styles.pulse,
                            {
                                width: sizes.dot * 2,
                                height: sizes.dot * 2,
                                borderRadius: sizes.dot,
                                borderColor: color,
                            }
                        ]}
                    />
                )}
            </View>

            {showLabel && (
                <Text style={[
                    styles.label,
                    {
                        color,
                        fontSize: sizes.fontSize,
                        marginLeft: sizes.padding,
                    }
                ]}>
                    {t(`status.${status}`)}
                </Text>
            )}
        </View>
    );
};

// Status indicator for compact display
export const StatusDot: React.FC<{
    status: ConnectivityStatus;
    size?: number;
}> = ({ status, size = 10 }) => {
    const { theme } = useTheme();

    const getColor = () => {
        switch (status) {
            case 'online': return theme.colors.online;
            case 'limited': return theme.colors.limited;
            case 'offline': return theme.colors.offline;
            default: return theme.colors.textMuted;
        }
    };

    return (
        <View style={[
            styles.statusDot,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: getColor(),
            }
        ]} />
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    dotContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        zIndex: 2,
    },
    pulse: {
        position: 'absolute',
        borderWidth: 2,
        opacity: 0.4,
        zIndex: 1,
    },
    label: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusDot: {
        // Styled via inline
    },
});

export default StatusBadge;
