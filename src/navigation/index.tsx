// Iran Blackout - Navigation Setup

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { MainTabParamList, RootStackParamList } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TimelineScreen from '../screens/TimelineScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Icons (using Unicode symbols for simplicity - replace with react-native-vector-icons)
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab icon component
const TabIcon: React.FC<{ name: string; focused: boolean; color: string }> = ({
    name,
    focused,
    color
}) => {
    const icons: Record<string, string> = {
        Dashboard: '📊',
        Timeline: '📈',
        Alerts: '🔔',
        Settings: '⚙️',
    };

    return (
        <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.7 }}>
            {icons[name] || '•'}
        </Text>
    );
};

// Badge for alerts
const AlertBadge: React.FC<{ count: number }> = ({ count }) => {
    const { theme } = useTheme();

    if (count === 0) return null;

    return (
        <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
    );
};

// Main Tab Navigator
const MainTabs: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const unreadCount = useAppStore((s) => s.getUnreadAlertCount());

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => (
                    <View>
                        <TabIcon name={route.name} focused={focused} color={color} />
                        {route.name === 'Alerts' && <AlertBadge count={unreadCount} />}
                    </View>
                ),
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={HomeScreen}
                options={{ tabBarLabel: t('navigation.dashboard') }}
            />
            <Tab.Screen
                name="Timeline"
                component={TimelineScreen}
                options={{ tabBarLabel: t('navigation.timeline') }}
            />
            <Tab.Screen
                name="Alerts"
                component={AlertsScreen}
                options={{ tabBarLabel: t('navigation.alerts') }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarLabel: t('navigation.settings') }}
            />
        </Tab.Navigator>
    );
};

// Root navigator
export const AppNavigator: React.FC = () => {
    const { theme, colorScheme } = useTheme();

    const navigationTheme = colorScheme === 'dark' ? {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
        },
    } : {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -8,
        top: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
});

export default AppNavigator;
