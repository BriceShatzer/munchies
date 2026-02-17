interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

import { CACHE_TTL_SECONDS } from "@/config";

const DEFAULT_TTL = CACHE_TTL_SECONDS * 1000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  store.set(key, { data, expiresAt: Date.now() + ttl });
}

// Returns stale data if available
export function cacheGetStale<T>(key: string): T | null {
  const entry = store.get(key);
  return entry ? (entry.data as T) : null;
}
