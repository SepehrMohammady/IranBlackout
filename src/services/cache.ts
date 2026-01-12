// Offline Cache Service
// Uses AsyncStorage for persistent caching with timestamp-based expiry

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@iranblackout_cache_';
const DEFAULT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiryMs: number;
}

class CacheService {
    private prefix: string;

    constructor(prefix: string = CACHE_PREFIX) {
        this.prefix = prefix;
    }

    private getKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    async set<T>(key: string, data: T, expiryMs: number = DEFAULT_EXPIRY_MS): Promise<void> {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            expiryMs,
        };

        try {
            await AsyncStorage.setItem(this.getKey(key), JSON.stringify(entry));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const raw = await AsyncStorage.getItem(this.getKey(key));
            if (!raw) return null;

            const entry: CacheEntry<T> = JSON.parse(raw);
            const now = Date.now();

            // Check if expired
            if (now - entry.timestamp > entry.expiryMs) {
                await this.remove(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async getWithFallback<T>(
        key: string,
        fetchFn: () => Promise<T>,
        expiryMs: number = DEFAULT_EXPIRY_MS
    ): Promise<T> {
        // Try cache first
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        // Fetch fresh data
        try {
            const data = await fetchFn();
            await this.set(key, data, expiryMs);
            return data;
        } catch (error) {
            // If fetch fails, try to return stale cache
            const staleRaw = await AsyncStorage.getItem(this.getKey(key));
            if (staleRaw) {
                const entry: CacheEntry<T> = JSON.parse(staleRaw);
                console.warn('Using stale cache for:', key);
                return entry.data;
            }
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.getKey(key));
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(k => k.startsWith(this.prefix));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    async getLastUpdated(key: string): Promise<Date | null> {
        try {
            const raw = await AsyncStorage.getItem(this.getKey(key));
            if (!raw) return null;

            const entry = JSON.parse(raw);
            return new Date(entry.timestamp);
        } catch (error) {
            return null;
        }
    }
}

export const cache = new CacheService();
export default cache;
