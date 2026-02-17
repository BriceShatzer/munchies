import MainContent from "./components/layout/MainContent";
import { fetchWithCache } from "@/lib/api-client";
import {
  RestaurantsResponse,
  FiltersResponse,
  PriceRange,
  OpenStatusResponse,
} from "@/lib/types";

async function getData() {
  const [restaurantsResult, filtersResult, priceRangesResult] =
    await Promise.all([
      fetchWithCache<RestaurantsResponse>("/restaurants", "restaurants:all"),
      fetchWithCache<FiltersResponse>("/filter", "filters:all"),
      fetchWithCache<PriceRange[]>("/price-range", "price-range:all"),
    ]);

  const restaurants = restaurantsResult.data.restaurants || [];

  const openStatuses = await Promise.all(
    restaurants.map((r) =>
      fetchWithCache<OpenStatusResponse>(`/open/${r.id}`, `open:${r.id}`)
        .then((res) => res.data.is_open)
        .catch(() => false)
    )
  );

  const restaurantsWithStatus = restaurants.map((restaurant, i) => ({
    ...restaurant,
    is_open: openStatuses[i],
  }));

  return {
    restaurants: restaurantsWithStatus,
    filters: filtersResult.data.filters || [],
    priceRanges: priceRangesResult.data || [],
  };
}

export default async function Home() {
  const { restaurants, filters, priceRanges } = await getData();

  return (
    <MainContent
      restaurants={restaurants}
      filters={filters}
      priceRanges={priceRanges}
    />
  );
}
