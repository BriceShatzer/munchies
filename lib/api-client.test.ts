import { fetchWithCache } from "./api-client";
import { cacheGet, cacheSet, cacheGetStale } from "@/lib/cache";

jest.mock("@/lib/cache", () => ({
  cacheGet: jest.fn(),
  cacheSet: jest.fn(),
  cacheGetStale: jest.fn(),
}));

const mockCacheGet = cacheGet as jest.Mock;
const mockCacheSet = cacheSet as jest.Mock;
const mockCacheGetStale = cacheGetStale as jest.Mock;

const API_BASE = "https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api";

function mockFetchResponse(data: unknown, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("fetchWithCache", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetchResponse({});
  });

  describe("cache hit", () => {
    it("should return cached data without fetching", async () => {
      const cachedData = { id: 1, name: "Cached" };
      mockCacheGet.mockReturnValue(cachedData);

      const result = await fetchWithCache("/restaurants", "restaurants");

      expect(result).toEqual({ data: cachedData, fromCache: true });
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockCacheSet).not.toHaveBeenCalled();
    });
  });

  describe("cache miss - successful fetch", () => {
    it("should fetch from API and cache the result", async () => {
      const apiData = { id: 1, name: "Fresh" };
      mockCacheGet.mockReturnValue(null);
      global.fetch = mockFetchResponse(apiData);

      const result = await fetchWithCache("/restaurants", "restaurants");

      expect(result).toEqual({ data: apiData, fromCache: false });
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/restaurants`,
        { next: { revalidate: 0 } }
      );
      expect(mockCacheSet).toHaveBeenCalledWith("restaurants", apiData);
    });

    it("should construct the correct URL for different endpoints", async () => {
      mockCacheGet.mockReturnValue(null);
      global.fetch = mockFetchResponse([]);

      await fetchWithCache("/restaurants?price=$$", "filtered");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/restaurants?price=$$`,
        expect.any(Object)
      );
    });
  });

  describe("fetch failure with stale cache", () => {
    it("should return stale data when fetch fails", async () => {
      const staleData = { id: 1, name: "Stale" };
      mockCacheGet.mockReturnValue(null);
      mockCacheGetStale.mockReturnValue(staleData);
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const warnSpy = jest.spyOn(console, "warn").mockImplementation();
      const result = await fetchWithCache("/restaurants", "restaurants");

      expect(result).toEqual({ data: staleData, fromCache: true });
      expect(warnSpy).toHaveBeenCalledWith(
        "API request failed, returning stale cache for restaurants"
      );
      warnSpy.mockRestore();
    });

    it("should return stale data when API returns non-ok response", async () => {
      const staleData = [{ id: 1 }];
      mockCacheGet.mockReturnValue(null);
      mockCacheGetStale.mockReturnValue(staleData);
      global.fetch = mockFetchResponse(null, false, 500);

      jest.spyOn(console, "warn").mockImplementation();
      const result = await fetchWithCache("/restaurants", "restaurants");

      expect(result).toEqual({ data: staleData, fromCache: true });
      console.warn = jest.fn(); // cleanup
    });
  });

  describe("fetch failure without any cache", () => {
    it("should re-throw when no stale cache is available", async () => {
      mockCacheGet.mockReturnValue(null);
      mockCacheGetStale.mockReturnValue(null);
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        fetchWithCache("/restaurants", "restaurants")
      ).rejects.toThrow("Network error");
    });

    it("should re-throw on non-ok response with no stale cache", async () => {
      mockCacheGet.mockReturnValue(null);
      mockCacheGetStale.mockReturnValue(null);
      global.fetch = mockFetchResponse(null, false, 404);

      await expect(
        fetchWithCache("/restaurants", "restaurants")
      ).rejects.toThrow("API returned 404");
    });
  });

  describe("generic type handling", () => {
    it("should return typed data from API", async () => {
      interface Restaurant {
        id: number;
        name: string;
      }
      const apiData: Restaurant = { id: 1, name: "Test" };
      mockCacheGet.mockReturnValue(null);
      global.fetch = mockFetchResponse(apiData);

      const result = await fetchWithCache<Restaurant>(
        "/restaurants/1",
        "restaurant-1"
      );

      expect(result.data.id).toBe(1);
      expect(result.data.name).toBe("Test");
      expect(result.fromCache).toBe(false);
    });
  });
});
