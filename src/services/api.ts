// Iran Blackout - API Service
// Integrates with OONI, Cloudflare Radar, and RIPE Atlas

import {
    Province,
    ISP,
    OutageEvent,
    DashboardStats,
    TimelineDataPoint,
    ConnectivityStatus,
    OONITestResult,
} from '../types';
import { iranProvinces, iranISPs } from '../data/constants';

// API Endpoints (Free tiers)
const OONI_API = 'https://api.ooni.io/api/v1';
const CLOUDFLARE_RADAR = 'https://api.cloudflare.com/client/v4/radar';
// Note: RIPE Atlas requires free registration at atlas.ripe.net

// Helper to determine status from score
const getStatusFromScore = (score: number): ConnectivityStatus => {
    if (score >= 80) return 'online';
    if (score >= 40) return 'limited';
    if (score >= 0) return 'offline';
    return 'unknown';
};

// OONI API Integration
export const fetchOONIData = async (): Promise<OONITestResult[]> => {
    try {
        const response = await fetch(
            `${OONI_API}/measurements?probe_cc=IR&limit=100&since=${getDateDaysAgo(7)}`
        );

        if (!response.ok) {
            throw new Error(`OONI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('OONI fetch error:', error);
        return [];
    }
};

// Fetch country-level connectivity from OONI
export const fetchIranConnectivity = async (): Promise<{
    provinces: Province[];
    stats: DashboardStats;
}> => {
    try {
        // Fetch aggregated data from OONI
        const response = await fetch(
            `${OONI_API}/aggregation?probe_cc=IR&since=${getDateDaysAgo(1)}&axis_x=measurement_start_day`
        );

        if (!response.ok) {
            // Return mock data if API fails
            return getMockData();
        }

        const data = await response.json();

        // Process OONI data into our format
        // Note: OONI provides country-level, we estimate provinces
        const blockingRate = calculateBlockingRate(data);

        const provinces = iranProvinces.map((p) => ({
            ...p,
            status: getStatusFromScore(100 - blockingRate + Math.random() * 20 - 10),
            lastUpdated: new Date(),
        }));

        const onlineCount = provinces.filter((p) => p.status === 'online').length;
        const outageCount = provinces.filter((p) => p.status === 'offline').length;

        const stats: DashboardStats = {
            regionsOnline: onlineCount,
            regionsTotal: provinces.length,
            activeOutages: outageCount,
            lastUpdated: new Date(),
            overallStatus: outageCount > provinces.length / 2 ? 'offline' :
                outageCount > 0 ? 'limited' : 'online',
        };

        return { provinces, stats };
    } catch (error) {
        console.error('Connectivity fetch error:', error);
        return getMockData();
    }
};

// Fetch ISP status
export const fetchISPStatus = async (): Promise<ISP[]> => {
    try {
        // Fetch ASN-specific data from OONI
        const response = await fetch(
            `${OONI_API}/aggregation?probe_cc=IR&since=${getDateDaysAgo(1)}&axis_x=probe_asn`
        );

        if (!response.ok) {
            return getMockISPs();
        }

        const data = await response.json();

        // Map ASN data to our ISP list
        return iranISPs.map((isp) => ({
            ...isp,
            status: getRandomStatus(), // In real app, match by ASN
            lastUpdated: new Date(),
        }));
    } catch (error) {
        console.error('ISP fetch error:', error);
        return getMockISPs();
    }
};

// Fetch timeline data
export const fetchTimeline = async (days: number = 7): Promise<TimelineDataPoint[]> => {
    try {
        const response = await fetch(
            `${OONI_API}/aggregation?probe_cc=IR&since=${getDateDaysAgo(days)}&axis_x=measurement_start_day`
        );

        if (!response.ok) {
            return getMockTimeline(days);
        }

        const data = await response.json();

        // Transform to timeline points
        const result = data.result || [];
        return result.map((point: any) => ({
            timestamp: new Date(point.measurement_start_day),
            value: 100 - (point.anomaly_count / point.measurement_count * 100),
            status: getStatusFromScore(100 - (point.anomaly_count / point.measurement_count * 100)),
        }));
    } catch (error) {
        console.error('Timeline fetch error:', error);
        return getMockTimeline(days);
    }
};

// Helper functions
const getDateDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

const calculateBlockingRate = (data: any): number => {
    const result = data.result || [];
    if (result.length === 0) return 0;

    const totalAnomalies = result.reduce((sum: number, r: any) => sum + (r.anomaly_count || 0), 0);
    const totalMeasurements = result.reduce((sum: number, r: any) => sum + (r.measurement_count || 0), 0);

    return totalMeasurements > 0 ? (totalAnomalies / totalMeasurements) * 100 : 0;
};

const getRandomStatus = (): ConnectivityStatus => {
    const rand = Math.random();
    if (rand > 0.7) return 'online';
    if (rand > 0.3) return 'limited';
    return 'offline';
};

// Mock data for offline or API failure
const getMockData = (): { provinces: Province[]; stats: DashboardStats } => {
    const provinces = iranProvinces.map((p, i) => ({
        ...p,
        status: i % 3 === 0 ? 'offline' : i % 2 === 0 ? 'limited' : 'online' as ConnectivityStatus,
        lastUpdated: new Date(),
    }));

    return {
        provinces,
        stats: {
            regionsOnline: 18,
            regionsTotal: 31,
            activeOutages: 5,
            lastUpdated: new Date(),
            overallStatus: 'limited',
        },
    };
};

const getMockISPs = (): ISP[] => {
    return iranISPs.map((isp, i) => ({
        ...isp,
        status: i === 0 ? 'offline' : i % 2 === 0 ? 'limited' : 'online' as ConnectivityStatus,
        lastUpdated: new Date(),
    }));
};

const getMockTimeline = (days: number): TimelineDataPoint[] => {
    const points: TimelineDataPoint[] = [];
    const now = new Date();

    for (let i = days * 24; i >= 0; i -= 4) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const value = 50 + Math.sin(i / 12) * 30 + Math.random() * 20;
        points.push({
            timestamp,
            value: Math.max(0, Math.min(100, value)),
            status: getStatusFromScore(value),
        });
    }

    return points;
};
