// Iran Blackout - Main App Entry

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme';
import { AppNavigator } from './src/navigation';

// Import i18n to initialize
import './src/i18n';

// Ignore specific warnings in development
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <StatusBar translucent backgroundColor="transparent" />
                <AppNavigator />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
};

export default App;
