import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, typography } from '../theme';
import IranMap from '../components/IranMap';
import ISPStatusCard from '../components/ISPStatusCard';
import { ISP, Region, ConnectivityStatus } from '../types';

// Mock data for demonstration
const mockRegions: Region[] = [
    { id: 'tehran', nameEn: 'Tehran', nameFa: 'تهران', status: 'online', lastUpdated: new Date().toISOString() },
    { id: 'isfahan', nameEn: 'Isfahan', nameFa: 'اصفهان', status: 'limited', lastUpdated: new Date().toISOString() },
    { id: 'shiraz', nameEn: 'Shiraz', nameFa: 'شیراز', status: 'online', lastUpdated: new Date().toISOString() },
    { id: 'mashhad', nameEn: 'Mashhad', nameFa: 'مشهد', status: 'offline', lastUpdated: new Date().toISOString() },
    { id: 'tabriz', nameEn: 'Tabriz', nameFa: 'تبریز', status: 'online', lastUpdated: new Date().toISOString() },
];

const mockISPs: ISP[] = [
    { id: 'mci', nameEn: 'MCI (Hamrah-e-Aval)', nameFa: 'همراه اول', type: 'mobile', status: 'online', lastUpdated: new Date().toISOString() },
    { id: 'irancell', nameEn: 'Irancell', nameFa: 'ایرانسل', type: 'mobile', status: 'limited', lastUpdated: new Date().toISOString() },
    { id: 'rightel', nameEn: 'Rightel', nameFa: 'رایتل', type: 'mobile', status: 'online', lastUpdated: new Date().toISOString() },
    { id: 'tci', nameEn: 'TCI', nameFa: 'مخابرات', type: 'fixed', status: 'online', lastUpdated: new Date().toISOString() },
    { id: 'shatel', nameEn: 'Shatel', nameFa: 'شاتل', type: 'fixed', status: 'offline', lastUpdated: new Date().toISOString() },
    { id: 'asiatech', nameEn: 'Asiatech', nameFa: 'آسیاتک', type: 'fixed', status: 'online', lastUpdated: new Date().toISOString() },
];

const HomeScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDark, isRTL } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [regions] = useState<Region[]>(mockRegions);
    const [isps] = useState<ISP[]>(mockISPs);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // TODO: Fetch real data from APIs
        await new Promise<void>(resolve => setTimeout(resolve, 1500));
        setRefreshing(false);
    }, []);

    const isFarsi = i18n.language === 'fa';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Header */}
                <View style={[styles.header, isRTL && styles.headerRTL]}>
                    <Text style={[typography.h1, styles.appName, { color: colors.primary }]}>
                        {t('common.appName')}
                    </Text>
                    <Text style={[typography.body, styles.subtitle, { color: colors.textSecondary }]}>
                        {t('home.subtitle')}
                    </Text>
                </View>

                {/* Motivational message */}
                <View style={[styles.messageCard, { backgroundColor: colors.primary }]}>
                    <Text style={[typography.body, styles.message]}>
                        {t('messages.stayStrong')}
                    </Text>
                </View>

                {/* Iran Map */}
                <View style={styles.section}>
                    <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
                        {t('home.mapTitle')}
                    </Text>
                    <View style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
                        <IranMap regions={regions} />
                    </View>
                </View>

                {/* ISP Status List */}
                <View style={styles.section}>
                    <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
                        {t('home.ispTitle')}
                    </Text>
                    <View style={styles.ispList}>
                        {isps.map((isp) => (
                            <ISPStatusCard key={isp.id} isp={isp} isFarsi={isFarsi} />
                        ))}
                    </View>
                </View>

                {/* Footer message */}
                <View style={styles.footer}>
                    <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
                        {t('messages.together')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    headerRTL: {
        alignItems: 'flex-end',
    },
    appName: {
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 8,
    },
    messageCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    message: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    mapContainer: {
        borderRadius: 16,
        padding: 16,
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ispList: {
        gap: 12,
    },
    footer: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
});

export default HomeScreen;
