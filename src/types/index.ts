// Iran Blackout - Type Definitions

// Connectivity status
export type ConnectivityStatus = 'online' | 'limited' | 'offline' | 'unknown';

// Province/Region data
export interface Province {
    id: string;
    nameEn: string;
    nameFa: string;
    status: ConnectivityStatus;
    lastUpdated: Date;
    population?: number;
}

// ISP/MNO data
export interface ISP {
    id: string;
    nameEn: string;
    nameFa: string;
    type: 'mobile' | 'fixed' | 'both';
    status: ConnectivityStatus;
    lastUpdated: Date;
    affectedRegions?: string[];
}

// Outage event
export interface OutageEvent {
    id: string;
    provinceId?: string;
    ispId?: string;
    status: ConnectivityStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number; // minutes
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    affectedUsers?: number;
    source: 'crowdsourced' | 'ooni' | 'cloudflare' | 'ripe';
}

// Alert/Notification
export interface Alert {
    id: string;
    type: 'outage' | 'restoration' | 'limited' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    provinceId?: string;
    ispId?: string;
}

// Telemetry report (anonymous, privacy-preserving)
export interface TelemetryReport {
    timestamp: Date;
    province: string; // City-level only, no GPS
    isp: string;
    status: ConnectivityStatus;
    latency?: number; // ms
    // NO device identifiers, NO GPS coordinates
}

// API Response types
export interface OONITestResult {
    test_name: string;
    test_start_time: string;
    probe_cc: string; // Country code
    probe_asn: string; // ASN
    scores: {
        blocking_general: number;
        blocking_dns: number;
        blocking_tcp: number;
        blocking_http: number;
    };
}

export interface CloudflareRadarData {
    timestamp: string;
    countryCode: string;
    trafficLevel: number; // 0-100
    change: number; // percentage change
}

// Dashboard statistics
export interface DashboardStats {
    regionsOnline: number;
    regionsTotal: number;
    activeOutages: number;
    lastUpdated: Date;
    overallStatus: ConnectivityStatus;
}

// Timeline data point
export interface TimelineDataPoint {
    timestamp: Date;
    value: number; // 0-100 connectivity score
    status: ConnectivityStatus;
}

// Settings
export interface AppSettings {
    theme: 'dark' | 'light';
    language: 'en' | 'fa';
    pushNotifications: boolean;
    alertOutages: boolean;
    alertRestorations: boolean;
    anonymousReporting: boolean;
}

// Navigation types
export type RootStackParamList = {
    Main: undefined;
    ProvinceDetail: { provinceId: string };
    ISPDetail: { ispId: string };
};

export type MainTabParamList = {
    Dashboard: undefined;
    Timeline: undefined;
    Alerts: undefined;
    Settings: undefined;
};
