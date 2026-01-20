import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

// Material Design icons - outline when inactive, filled when active
const TabIcon: React.FC<{ name: string; focused: boolean; color: string }> = ({ name, focused, color }) => {
    const icons: Record<string, { active: string; inactive: string }> = {
        home: { active: 'home', inactive: 'home-outline' },
        timeline: { active: 'chart-bar', inactive: 'chart-bar' },
        alerts: { active: 'bell', inactive: 'bell-outline' },
        settings: { active: 'cog', inactive: 'cog-outline' },
    };

    const iconSet = icons[name] || { active: 'circle', inactive: 'circle-outline' };
    const iconName = focused ? iconSet.active : iconSet.inactive;

    return <Icon name={iconName} size={24} color={color} />;
};


const RootNavigator: React.FC = () => {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    return (
        <NavigationContainer
            theme={{
                dark: isDark,
                colors: {
                    primary: isDark ? colors.accent : colors.primary, // Better contrast in dark mode
                    background: 'transparent', // Allow video background to show
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
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', // Semi-transparent nav bar
                        borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderTopWidth: 1,
                        paddingTop: 8,
                        paddingBottom: 8,
                        height: 60,
                        position: 'absolute', // Make tab bar float
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: isDark ? colors.accent : colors.primary, // Fix contrast
                    tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={() => ({
                        tabBarLabel: t('tabs.home'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="home" focused={focused} color={color} />
                        ),
                    })}
                />
                <Tab.Screen
                    name="Timeline"
                    component={TimelineScreen}
                    options={() => ({
                        tabBarLabel: t('tabs.timeline'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="timeline" focused={focused} color={color} />
                        ),
                    })}
                />
                <Tab.Screen
                    name="Alerts"
                    component={AlertsScreen}
                    options={() => ({
                        tabBarLabel: t('tabs.alerts'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="alerts" focused={focused} color={color} />
                        ),
                    })}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={() => ({
                        tabBarLabel: t('tabs.settings'),
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon name="settings" focused={focused} color={color} />
                        ),
                    })}
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
