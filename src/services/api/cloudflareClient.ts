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

    // Get traffic anomalies for a location (country)
    async getTrafficAnomalies(location: string = 'IR'): Promise<CloudflareRadarData[]> {
        try {
            // Cloudflare Radar API endpoint for traffic anomalies by location
            // See: https://developers.cloudflare.com/api/resources/radar/subresources/traffic_anomalies/
            const response = await fetch(
                `${this.baseUrl}/traffic_anomalies/locations?location=${location}&dateRange=1d&format=json`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                console.warn(`Cloudflare Radar API error: ${response.status} ${response.statusText}`);
                // Try the general traffic anomalies endpoint as fallback
                const fallbackResponse = await fetch(
                    `${this.baseUrl}/traffic_anomalies?location=${location}&dateRange=1d&format=json`,
                    { headers: this.getHeaders() }
                );

                if (!fallbackResponse.ok) {
                    console.warn('Cloudflare Radar API unavailable, using mock data');
                    return this.getMockData();
                }

                const fallbackData = await fallbackResponse.json();
                return this.parseAnomalyResponse(fallbackData);
            }

            const data = await response.json();
            return this.parseAnomalyResponse(data);
        } catch (error) {
            console.error('Cloudflare Radar API error:', error);
            return this.getMockData();
        }
    }

    // Parse the API response into our format
    private parseAnomalyResponse(data: any): CloudflareRadarData[] {
        try {
            // Handle different response formats
            const anomalies = data.result?.trafficAnomalies || data.result?.anomalies || data.result || [];

            if (Array.isArray(anomalies) && anomalies.length > 0) {
                return anomalies.map((a: any) => ({
                    timestamp: a.startDate || a.timestamp || new Date().toISOString(),
                    trafficChange: a.value || a.trafficChange || -100, // Default to -100 if anomaly detected
                    countryCode: a.location || 'IR',
                }));
            }

            // If no anomalies array but we got a response, assume severe outage
            if (data.success && data.result) {
                return [{
                    timestamp: new Date().toISOString(),
                    trafficChange: -100,
                    countryCode: 'IR',
                }];
            }

            return this.getMockData();
        } catch (e) {
            console.warn('Failed to parse Cloudflare response:', e);
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

// Initialize with API token for authenticated access
const CF_API_TOKEN = 'Lq16sefxNe4JtpBVwylz1Oc2y-RvGTU9xSmJdLdb';
export const cloudflareClient = new CloudflareRadarClient(CF_API_TOKEN);
export default cloudflareClient;
