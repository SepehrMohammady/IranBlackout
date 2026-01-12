// OONI Explorer API Client
// OONI (Open Observatory of Network Interference) provides network measurement data
// API Documentation: https://api.ooni.io/

import { OONIMeasurement } from '../../types';

const OONI_BASE_URL = 'https://api.ooni.io/api/v1';

export interface OONIListParams {
    probe_cc?: string; // Country code (IR for Iran)
    test_name?: string; // e.g., 'web_connectivity', 'signal', 'whatsapp'
    since?: string; // ISO date
    until?: string; // ISO date
    limit?: number;
    offset?: number;
}

export interface OONIListResponse {
    metadata: {
        count: number;
        current_page: number;
        limit: number;
        offset: number;
        pages: number;
    };
    results: OONIMeasurement[];
}

class OONIClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = OONI_BASE_URL;
    }

    async getMeasurements(params: OONIListParams = {}): Promise<OONIListResponse> {
        const queryParams = new URLSearchParams({
            probe_cc: params.probe_cc || 'IR',
            limit: String(params.limit || 100),
            offset: String(params.offset || 0),
        });

        if (params.test_name) {
            queryParams.append('test_name', params.test_name);
        }
        if (params.since) {
            queryParams.append('since', params.since);
        }
        if (params.until) {
            queryParams.append('until', params.until);
        }

        try {
            const response = await fetch(`${this.baseUrl}/measurements?${queryParams}`);
            if (!response.ok) {
                throw new Error(`OONI API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('OONI API request failed:', error);
            throw error;
        }
    }

    async getRecentAnomalies(hours: number = 24): Promise<OONIMeasurement[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString().split('T')[0];

        try {
            const response = await this.getMeasurements({
                probe_cc: 'IR',
                since,
                limit: 200,
            });

            // Filter for anomalies and confirmed blocks
            return response.results.filter(m => m.anomaly || m.confirmed);
        } catch (error) {
            console.error('Failed to fetch recent anomalies:', error);
            return [];
        }
    }

    async getTestCoverage(): Promise<{ testName: string; count: number }[]> {
        try {
            const response = await fetch(`${this.baseUrl}/aggregation?probe_cc=IR&axis_x=test_name`);
            if (!response.ok) {
                throw new Error(`OONI API error: ${response.status}`);
            }
            const data = await response.json();
            return data.result || [];
        } catch (error) {
            console.error('Failed to fetch test coverage:', error);
            return [];
        }
    }
}

export const ooniClient = new OONIClient();
export default ooniClient;
