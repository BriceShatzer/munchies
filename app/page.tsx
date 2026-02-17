import MainContent from "./components/MainContent";
import { fetchWithCache } from "@/lib/api-client";
import {
  RestaurantsResponse,
  FiltersResponse,
  PriceRange,
} from "@/lib/types";

async function getData() {
  const [restaurantsResult, filtersResult, priceRangesResult] =
    await Promise.all([
      fetchWithCache<RestaurantsResponse>("/restaurants", "restaurants:all"),
      fetchWithCache<FiltersResponse>("/filter", "filters:all"),
      fetchWithCache<PriceRange[]>("/price-range", "price-range:all"),
    ]);

  return {
    restaurants: restaurantsResult.data.restaurants || [],
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
