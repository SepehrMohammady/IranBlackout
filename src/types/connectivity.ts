// Connectivity Status Types

export type ConnectivityStatus = 'online' | 'limited' | 'offline' | 'unknown';

export interface Region {
    id: string;
    nameEn: string;
    nameFa: string;
    status: ConnectivityStatus;
    lastUpdated: string; // ISO timestamp
    population?: number;
}

export interface ISP {
    id: string;
    nameEn: string;
    nameFa: string;
    type: 'mobile' | 'fixed' | 'both';
    status: ConnectivityStatus;
    lastUpdated: string;
    coverage?: number; // 0-100 percentage
}

export interface OutageEvent {
    id: string;
    regionId?: string;
    ispId?: string;
    startTime: string;
    endTime?: string;
    severity: 'partial' | 'major' | 'complete';
    description?: string;
    source: 'crowdsourced' | 'ooni' | 'cloudflare' | 'ripe' | 'manual';
}

export interface Alert {
    id: string;
    type: 'outage' | 'restoration' | 'partial' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    regionId?: string;
    ispId?: string;
}

export interface TelemetryReport {
    timestamp: string;
    city?: string; // City-level only, no precise GPS
    ispId?: string;
    status: ConnectivityStatus;
    latency?: number; // ms
    downloadSpeed?: number; // Mbps
}

export interface TimeSeriesDataPoint {
    timestamp: string;
    value: number; // 0-100 representing connectivity percentage
    label?: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        color?: (opacity: number) => string;
        strokeWidth?: number;
    }[];
}

// API Response types
export interface OONIMeasurement {
    measurement_uid: string;
    probe_cc: string;
    probe_asn: number;
    test_name: string;
    measurement_start_time: string;
    anomaly: boolean;
    confirmed: boolean;
    failure: boolean;
}

export interface CloudflareRadarData {
    timestamp: string;
    trafficChange: number;
    countryCode: string;
}

export interface RIPEAtlasProbe {
    id: number;
    country_code: string;
    status: {
        name: string;
    };
    last_connected: number;
}
