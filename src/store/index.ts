// Iran Blackout - Global State Store (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Province,
    ISP,
    OutageEvent,
    Alert,
    DashboardStats,
    TimelineDataPoint,
    AppSettings,
    ConnectivityStatus,
} from '../types';

// Store state interface
interface AppState {
    // Data
    provinces: Province[];
    isps: ISP[];
    outages: OutageEvent[];
    alerts: Alert[];
    timeline: TimelineDataPoint[];
    stats: DashboardStats | null;

    // UI State
    isLoading: boolean;
    isOffline: boolean;
    lastFetch: Date | null;
    error: string | null;

    // Settings
    settings: AppSettings;

    // Actions - Data
    setProvinces: (provinces: Province[]) => void;
    setISPs: (isps: ISP[]) => void;
    setOutages: (outages: OutageEvent[]) => void;
    addOutage: (outage: OutageEvent) => void;
    setTimeline: (data: TimelineDataPoint[]) => void;
    setStats: (stats: DashboardStats) => void;

    // Actions - Alerts
    setAlerts: (alerts: Alert[]) => void;
    addAlert: (alert: Alert) => void;
    markAlertRead: (alertId: string) => void;
    clearAllAlerts: () => void;

    // Actions - UI
    setLoading: (loading: boolean) => void;
    setOffline: (offline: boolean) => void;
    setError: (error: string | null) => void;
    setLastFetch: (date: Date) => void;

    // Actions - Settings
    updateSettings: (settings: Partial<AppSettings>) => void;

    // Computed
    getProvinceById: (id: string) => Province | undefined;
    getISPById: (id: string) => ISP | undefined;
    getUnreadAlertCount: () => number;
}

// Default settings
const defaultSettings: AppSettings = {
    theme: 'dark',
    language: 'en',
    pushNotifications: true,
    alertOutages: true,
    alertRestorations: true,
    anonymousReporting: true,
};

// Create store with persistence
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            provinces: [],
            isps: [],
            outages: [],
            alerts: [],
            timeline: [],
            stats: null,
            isLoading: false,
            isOffline: false,
            lastFetch: null,
            error: null,
            settings: defaultSettings,

            // Data actions
            setProvinces: (provinces) => set({ provinces }),
            setISPs: (isps) => set({ isps }),
            setOutages: (outages) => set({ outages }),
            addOutage: (outage) => set((state) => ({
                outages: [outage, ...state.outages].slice(0, 100), // Keep last 100
            })),
            setTimeline: (timeline) => set({ timeline }),
            setStats: (stats) => set({ stats }),

            // Alert actions
            setAlerts: (alerts) => set({ alerts }),
            addAlert: (alert) => set((state) => ({
                alerts: [alert, ...state.alerts].slice(0, 50), // Keep last 50
            })),
            markAlertRead: (alertId) => set((state) => ({
                alerts: state.alerts.map((a) =>
                    a.id === alertId ? { ...a, read: true } : a
                ),
            })),
            clearAllAlerts: () => set({ alerts: [] }),

            // UI actions
            setLoading: (isLoading) => set({ isLoading }),
            setOffline: (isOffline) => set({ isOffline }),
            setError: (error) => set({ error }),
            setLastFetch: (lastFetch) => set({ lastFetch }),

            // Settings actions
            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings },
            })),

            // Computed getters
            getProvinceById: (id) => get().provinces.find((p) => p.id === id),
            getISPById: (id) => get().isps.find((i) => i.id === id),
            getUnreadAlertCount: () => get().alerts.filter((a) => !a.read).length,
        }),
        {
            name: 'iran-blackout-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                // Only persist these fields
                provinces: state.provinces,
                isps: state.isps,
                outages: state.outages.slice(0, 20), // Keep fewer in storage
                alerts: state.alerts,
                stats: state.stats,
                lastFetch: state.lastFetch,
                settings: state.settings,
            }),
        }
    )
);

// Selectors for common use cases
export const selectStats = (state: AppState) => state.stats;
export const selectProvinces = (state: AppState) => state.provinces;
export const selectISPs = (state: AppState) => state.isps;
export const selectAlerts = (state: AppState) => state.alerts;
export const selectSettings = (state: AppState) => state.settings;
export const selectIsOffline = (state: AppState) => state.isOffline;
