import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import TimelineScreen from '../screens/TimelineScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootTabParamList = {
    Home: undefined;
    Timeline: undefined;
    Alerts: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Simple icon components (flat design)
const TabIcon: React.FC<{ name: string; focused: boolean; color: string }> = ({ name, focused, color }) => {
    const icons: Record<string, string> = {
        home: '🏠',
        timeline: '📊',
        alerts: '🔔',
        settings: '⚙️',
    };

    return (
        <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
            {icons[name] || '●'}
        </Text>
    );
};

const RootNavigator: React.FC = () => {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    return (
        <NavigationContainer
            theme={{
                dark: isDark,
                colors: {
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.text,
                    border: colors.border,
                    notification: colors.accent,
                },
                fonts: {
                    regular: { fontFamily: 'System', fontWeight: '400' },
                    medium: { fontFamily: 'System', fontWeight: '500' },
                    bold: { fontFamily: 'System', fontWeight: '700' },
                    heavy: { fontFamily: 'System', fontWeight: '800' },
                },
            }}
        >
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.surface,
                        borderTopColor: colors.border,
                        borderTopWidth: 1,
                        paddingTop: 8,
                        paddingBottom: 8,
                        height: 60,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: t('tabs.home'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="home" focused={focused} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Timeline"
                    component={TimelineScreen}
                    options={{
                        tabBarLabel: t('tabs.timeline'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="timeline" focused={focused} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Alerts"
                    component={AlertsScreen}
                    options={{
                        tabBarLabel: t('tabs.alerts'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="alerts" focused={focused} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: t('tabs.settings'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="settings" focused={focused} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
    },
});

export default RootNavigator;
