import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './theme';
import RootNavigator from './navigation/RootNavigator';
import './i18n';

// Ignore specific warnings in development
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const AppContent: React.FC = () => {
    const { isDark, colors } = useTheme();

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <RootNavigator />
        </>
    );
};

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
