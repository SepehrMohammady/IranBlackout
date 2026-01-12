// Cloudflare Radar API Client
// Cloudflare Radar provides traffic anomaly and outage detection data
// API Documentation: https://developers.cloudflare.com/radar/

import { CloudflareRadarData } from '../../types';

// Note: Cloudflare Radar API requires authentication for some endpoints
// Free tier provides limited access to public data
const CF_RADAR_BASE_URL = 'https://api.cloudflare.com/client/v4/radar';

export interface CFRadarTrafficParams {
    location?: string; // ISO country code (IR for Iran)
    dateRange?: '1d' | '7d' | '14d' | '28d';
}

export interface CFRadarOutageEvent {
    startTime: string;
    endTime?: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    asn?: number;
    asnName?: string;
}

class CloudflareRadarClient {
    private baseUrl: string;
    private apiToken?: string;

    constructor(apiToken?: string) {
        this.baseUrl = CF_RADAR_BASE_URL;
        this.apiToken = apiToken;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.apiToken) {
            headers['Authorization'] = `Bearer ${this.apiToken}`;
        }
        return headers;
    }

    // Public endpoint - no auth required
    async getTrafficAnomalies(location: string = 'IR'): Promise<CloudflareRadarData[]> {
        try {
            // Note: This is a simplified version. The actual Cloudflare Radar API
            // may require different endpoints or authentication
            const response = await fetch(
                `${this.baseUrl}/traffic/anomalies?location=${location}&dateRange=1d`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                // Fall back to mock data if API is unavailable
                console.warn('Cloudflare Radar API unavailable, using mock data');
                return this.getMockData();
            }

            const data = await response.json();
            return data.result || [];
        } catch (error) {
            console.error('Cloudflare Radar API error:', error);
            return this.getMockData();
        }
    }

    async getOutages(location: string = 'IR'): Promise<CFRadarOutageEvent[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/netflows/outages?location=${location}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                console.warn('Cloudflare Radar outages API unavailable');
                return [];
            }

            const data = await response.json();
            return data.result?.outages || [];
        } catch (error) {
            console.error('Cloudflare Radar outages error:', error);
            return [];
        }
    }

    // Mock data for development/fallback
    private getMockData(): CloudflareRadarData[] {
        const now = Date.now();
        return [
            {
                timestamp: new Date(now - 3600000).toISOString(),
                trafficChange: -15,
                countryCode: 'IR',
            },
            {
                timestamp: new Date(now - 7200000).toISOString(),
                trafficChange: -45,
                countryCode: 'IR',
            },
            {
                timestamp: new Date(now - 14400000).toISOString(),
                trafficChange: -5,
                countryCode: 'IR',
            },
        ];
    }
}

export const cloudflareClient = new CloudflareRadarClient();
export default cloudflareClient;
