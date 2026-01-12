// Iran Blackout - Card Component

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
    children: ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    elevated?: boolean;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    style,
    elevated = false,
    noPadding = false,
}) => {
    const { theme } = useTheme();

    const cardStyle = [
        styles.card,
        {
            backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
        },
        elevated && theme.spacing.shadow.md,
        !noPadding && styles.padding,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

// Stat card for dashboard
interface StatCardProps {
    label: string;
    value: string | number;
    icon?: string;
    color?: string;
    onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    color,
    onPress,
}) => {
    const { theme } = useTheme();

    return (
        <Card onPress={onPress} style={styles.statCard}>
            <View style={styles.statHeader}>
                {icon && (
                    <View style={[styles.iconContainer, { backgroundColor: (color || theme.colors.primary) + '20' }]}>
                        <View style={{ opacity: 1 }}>
                            {/* Icon placeholder */}
                        </View>
                    </View>
                )}
            </View>
            <View style={[
                styles.statValue,
                { color: color || theme.colors.text }
            ]}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <View>
                        {/* Value text component would go here */}
                    </View>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
    },
    padding: {
        padding: 16,
    },
    statCard: {
        flex: 1,
        minHeight: 100,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        marginTop: 4,
    },
});

export default Card;
