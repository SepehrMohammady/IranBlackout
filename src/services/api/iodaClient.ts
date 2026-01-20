// IODA (Internet Outage Detection and Analysis) API Client
// Georgia Tech's free, open-source API for internet outage detection
// API Documentation: https://api.ioda.inetintel.cc.gatech.edu/v2/

import { Alert } from '../../types';

const IODA_BASE_URL = 'https://api.ioda.inetintel.cc.gatech.edu/v2';

export interface IODAOutageEvent {
    id: string;
    entityType: string;
    entityCode: string;
    entityName: string;
    startTime: number; // Unix timestamp
    endTime?: number;
    score: number;
    datasource: string;
}

export interface IODASignalData {
    timestamp: number;
    value: number;
}

export interface IODATimeSeriesResponse {
    data: {
        [datasource: string]: {
            values: [number, number][]; // [timestamp, value]
        };
    };
}

class IODAClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = IODA_BASE_URL;
    }

    // Get outage events for Iran (country code: IR)
    async getOutageEvents(options: {
        entityType?: 'country' | 'asn' | 'region';
        entityCode?: string;
        from?: number; // Unix timestamp
        until?: number;
        limit?: number;
    } = {}): Promise<IODAOutageEvent[]> {
        try {
            const {
                entityType = 'country',
                entityCode = 'IR',
                from = Math.floor(Date.now() / 1000) - 7 * 24 * 3600, // Last 7 days
                until = Math.floor(Date.now() / 1000),
                limit = 50,
            } = options;

            const url = `${this.baseUrl}/outages/events?entityType=${entityType}&entityCode=${entityCode}&from=${from}&until=${until}&limit=${limit}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`IODA API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            return this.parseEventsResponse(data);
        } catch (error) {
            console.error('IODA API error:', error);
            return [];
        }
    }

    // Get outage alerts (more granular than events)
    async getOutageAlerts(options: {
        entityType?: 'country' | 'asn' | 'region';
        entityCode?: string;
        from?: number;
        until?: number;
        limit?: number;
    } = {}): Promise<Alert[]> {
        try {
            const {
                entityType = 'country',
                entityCode = 'IR',
                from = Math.floor(Date.now() / 1000) - 24 * 3600, // Last 24 hours
                until = Math.floor(Date.now() / 1000),
                limit = 20,
            } = options;

            const url = `${this.baseUrl}/outages/alerts?entityType=${entityType}&entityCode=${entityCode}&from=${from}&until=${until}&limit=${limit}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`IODA Alerts API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            return this.parseAlertsResponse(data);
        } catch (error) {
            console.error('IODA Alerts API error:', error);
            return [];
        }
    }

    // Get time-series signals for Iran (for Timeline chart)
    async getSignals(options: {
        entityType?: 'country' | 'asn';
        entityCode?: string;
        from?: number;
        until?: number;
        datasource?: 'bgp' | 'ping-slash24' | 'merit-nt';
        maxPoints?: number;
    } = {}): Promise<IODASignalData[]> {
        try {
            const {
                entityType = 'country',
                entityCode = 'IR',
                from = Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
                until = Math.floor(Date.now() / 1000),
                datasource = 'bgp',
                maxPoints = 100,
            } = options;

            const url = `${this.baseUrl}/signals/raw/${entityType}/${entityCode}?from=${from}&until=${until}&datasource=${datasource}&maxPoints=${maxPoints}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`IODA Signals API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            return this.parseSignalsResponse(data, datasource);
        } catch (error) {
            console.error('IODA Signals API error:', error);
            return [];
        }
    }

    private parseEventsResponse(data: any): IODAOutageEvent[] {
        try {
            const events = data.data || [];
            return events.map((e: any) => ({
                id: e.id || `${e.entityCode}-${e.startTime}`,
                entityType: e.entity?.type || 'unknown',
                entityCode: e.entity?.code || '',
                entityName: e.entity?.name || '',
                startTime: e.start || 0,
                endTime: e.end,
                score: e.score || 0,
                datasource: e.datasource || '',
            }));
        } catch (e) {
            console.warn('Failed to parse IODA events:', e);
            return [];
        }
    }

    private parseAlertsResponse(data: any): Alert[] {
        try {
            const alerts = data.data || [];
            return alerts.map((a: any, index: number) => {
                const score = a.score || 0;
                let type: Alert['type'] = 'info';
                if (score >= 80) type = 'outage';
                else if (score >= 50) type = 'partial';
                else if (a.direction === 'up') type = 'restoration';

                return {
                    id: a.id || `${index}-${a.time}`,
                    type,
                    title: this.generateAlertTitle(a, type),
                    message: this.generateAlertMessage(a),
                    timestamp: new Date((a.time || Date.now() / 1000) * 1000).toISOString(),
                    read: false,
                    regionId: a.entity?.type === 'region' ? a.entity.code : undefined,
                    ispId: a.entity?.type === 'asn' ? a.entity.code : undefined,
                };
            });
        } catch (e) {
            console.warn('Failed to parse IODA alerts:', e);
            return [];
        }
    }

    private generateAlertTitle(alert: any, type: Alert['type']): string {
        const entityName = alert.entity?.name || 'Iran';
        // Simplify entity name (remove "Islamic Republic Of" etc.)
        const cleanName = entityName.replace(/\s*\(Islamic Republic Of\)/i, '').trim();
        // Return JSON string to be parsed by component
        return JSON.stringify({ type, entityName: cleanName });
    }

    private generateAlertMessage(alert: any): string {
        const score = alert.score || 0;
        let msgKey = '';
        if (score >= 80) {
            msgKey = 'majorOutageMsg';
        } else if (score >= 50) {
            msgKey = 'partialOutageMsg';
        } else if (alert.direction === 'up') {
            msgKey = 'restorationMsg';
        } else {
            msgKey = 'networkUpdateMsg';
        }
        return JSON.stringify({ key: msgKey, score });
    }

    private parseSignalsResponse(data: any, datasource: string): IODASignalData[] {
        try {
            const signals = data.data?.[datasource]?.values || [];
            return signals.map((s: [number, number]) => ({
                timestamp: s[0],
                value: s[1],
            }));
        } catch (e) {
            console.warn('Failed to parse IODA signals:', e);
            return [];
        }
    }
}

export const iodaClient = new IODAClient();
export default iodaClient;
