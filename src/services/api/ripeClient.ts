// RIPE Atlas API Client
// RIPE Atlas provides network measurement data from probes worldwide
// API Documentation: https://atlas.ripe.net/docs/apis/

import { RIPEAtlasProbe } from '../../types';

const RIPE_ATLAS_BASE_URL = 'https://atlas.ripe.net/api/v2';

export interface RIPEProbeParams {
    country_code?: string; // IR for Iran
    status?: 1 | 2 | 3; // 1=Connected, 2=Disconnected, 3=Abandoned
    is_public?: boolean;
}

export interface RIPEMeasurementResult {
    probe_id: number;
    timestamp: number;
    result: any;
    from?: string;
}

class RIPEAtlasClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = RIPE_ATLAS_BASE_URL;
    }

    async getProbes(params: RIPEProbeParams = {}): Promise<RIPEAtlasProbe[]> {
        const queryParams = new URLSearchParams({
            country_code: params.country_code || 'IR',
            is_public: 'true',
        });

        if (params.status !== undefined) {
            queryParams.append('status', String(params.status));
        }

        try {
            const response = await fetch(`${this.baseUrl}/probes?${queryParams}`);
            if (!response.ok) {
                throw new Error(`RIPE Atlas API error: ${response.status}`);
            }
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('RIPE Atlas API request failed:', error);
            return [];
        }
    }

    async getProbeStatus(): Promise<{ connected: number; disconnected: number; total: number }> {
        try {
            const [connected, disconnected] = await Promise.all([
                this.getProbes({ country_code: 'IR', status: 1 }),
                this.getProbes({ country_code: 'IR', status: 2 }),
            ]);

            return {
                connected: connected.length,
                disconnected: disconnected.length,
                total: connected.length + disconnected.length,
            };
        } catch (error) {
            console.error('Failed to fetch probe status:', error);
            return { connected: 0, disconnected: 0, total: 0 };
        }
    }

    async getRecentMeasurements(measurementId: number): Promise<RIPEMeasurementResult[]> {
        try {
            const response = await fetch(`${this.baseUrl}/measurements/${measurementId}/latest/`);
            if (!response.ok) {
                throw new Error(`RIPE Atlas API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('RIPE Atlas measurement fetch failed:', error);
            return [];
        }
    }

    // Get connectivity health based on probe status
    async getConnectivityHealth(): Promise<number> {
        const status = await this.getProbeStatus();
        if (status.total === 0) return -1; // No data
        return Math.round((status.connected / status.total) * 100);
    }
}

export const ripeClient = new RIPEAtlasClient();
export default ripeClient;
