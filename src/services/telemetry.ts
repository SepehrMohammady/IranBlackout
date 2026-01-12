// Anonymous Telemetry Service
// Privacy-preserving crowdsourced connectivity reports
// NO GPS coordinates - only city-level location from IP/network info

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelemetryReport, ConnectivityStatus } from '../types';

const TELEMETRY_KEY = '@iranblackout_telemetry';
const DEVICE_ID_KEY = '@iranblackout_device_id';
const TELEMETRY_ENABLED_KEY = '@iranblackout_telemetry_enabled';

// Telemetry endpoint (to be configured)
const TELEMETRY_ENDPOINT = 'https://api.iranblackout.app/telemetry'; // Placeholder

class TelemetryService {
    private deviceId: string | null = null;
    private enabled: boolean = true;

    async initialize(): Promise<void> {
        // Get or generate anonymous device ID
        let storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        if (!storedId) {
            // Generate random device ID (no personal identifiers)
            storedId = this.generateAnonymousId();
            await AsyncStorage.setItem(DEVICE_ID_KEY, storedId);
        }
        this.deviceId = storedId;

        // Check if telemetry is enabled
        const enabledStr = await AsyncStorage.getItem(TELEMETRY_ENABLED_KEY);
        this.enabled = enabledStr !== 'false';
    }

    private generateAnonymousId(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 16; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    async setEnabled(enabled: boolean): Promise<void> {
        this.enabled = enabled;
        await AsyncStorage.setItem(TELEMETRY_ENABLED_KEY, String(enabled));
    }

    async isEnabled(): Promise<boolean> {
        const enabledStr = await AsyncStorage.getItem(TELEMETRY_ENABLED_KEY);
        return enabledStr !== 'false';
    }

    async reportConnectivity(
        status: ConnectivityStatus,
        ispId?: string,
        city?: string,
        latency?: number
    ): Promise<void> {
        if (!this.enabled) return;

        const report: TelemetryReport = {
            timestamp: new Date().toISOString(),
            status,
            ispId,
            city, // City-level only, no GPS
            latency,
        };

        // Store locally first
        await this.storeReport(report);

        // Try to send to server
        try {
            await this.sendReport(report);
        } catch (error) {
            // Failed to send - will be retried later
            console.warn('Failed to send telemetry report:', error);
        }
    }

    private async storeReport(report: TelemetryReport): Promise<void> {
        try {
            const stored = await AsyncStorage.getItem(TELEMETRY_KEY);
            const reports: TelemetryReport[] = stored ? JSON.parse(stored) : [];

            // Keep last 100 reports
            reports.push(report);
            if (reports.length > 100) {
                reports.shift();
            }

            await AsyncStorage.setItem(TELEMETRY_KEY, JSON.stringify(reports));
        } catch (error) {
            console.error('Failed to store telemetry:', error);
        }
    }

    private async sendReport(report: TelemetryReport): Promise<void> {
        // Note: In production, this would send to a real endpoint
        // For now, this is a placeholder that logs the report
        if (__DEV__) {
            console.log('Telemetry report (would send):', {
                deviceId: this.deviceId?.substring(0, 4) + '...', // Only log partial ID
                ...report,
            });
            return;
        }

        const response = await fetch(TELEMETRY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deviceId: this.deviceId,
                ...report,
            }),
        });

        if (!response.ok) {
            throw new Error(`Telemetry send failed: ${response.status}`);
        }
    }

    async retryPendingReports(): Promise<void> {
        // In a production app, this would retry sending stored reports
        // that failed to send previously
    }

    async getLocalReports(): Promise<TelemetryReport[]> {
        try {
            const stored = await AsyncStorage.getItem(TELEMETRY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }

    async clearLocalReports(): Promise<void> {
        await AsyncStorage.removeItem(TELEMETRY_KEY);
    }
}

export const telemetry = new TelemetryService();
export default telemetry;
