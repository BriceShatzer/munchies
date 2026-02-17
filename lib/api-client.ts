import { cacheGet, cacheSet, cacheGetStale } from "@/lib/cache";
import { API_BASE_URL, CACHE_TTL_SECONDS } from "@/config";

const API_BASE = `${API_BASE_URL}/api`;

export async function fetchWithCache<T>(
  endpoint: string,
  cacheKey: string
): Promise<{ data: T; fromCache: boolean }> {
  // Try to get from cache first
  const cached = cacheGet<T>(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    // Fetch from external API
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: CACHE_TTL_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = (await response.json()) as T;
    cacheSet(cacheKey, data);
    return { data, fromCache: false };
  } catch (error) {
    // Try to return stale data if fetch fails
    const stale = cacheGetStale<T>(cacheKey);
    if (stale) {
      console.warn(`API request failed, returning stale cache for ${cacheKey}`);
      return { data: stale, fromCache: true };
    }

    // No cache available, throw error
    throw error;
  }
}
