"use client";

import { useState, useCallback } from "react";
import styles from "./MainContent.module.css";
import Header from "./Header";
import FilterSidebar from "../filters/FilterSidebar";
import CategoryCarousel from "../filters/CategoryCarousel";
import RestaurantGrid from "../restaurant/RestaurantGrid";
import MobileSplash from "../MobileSplash";
import { Restaurant, Filter, PriceRange } from "@/lib/types";

interface MainContentProps {
  restaurants: Restaurant[];
  filters: Filter[];
  priceRanges: PriceRange[];
}

const DELIVERY_TIME_RANGES: Record<string, [number, number]> = {
  "0-10": [0, 10],
  "10-30": [10, 30],
  "30-60": [30, 60],
  "60+": [60, Infinity],
};

export default function MainContent({
  restaurants,
  filters,
  priceRanges,
}: MainContentProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<string[]>(
    []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const toggleDeliveryTime = useCallback((time: string) => {
    setSelectedDeliveryTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }, []);

  const togglePriceRange = useCallback((id: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Food category filter
    if (selectedCategories.length > 0) {
      const hasMatch = restaurant.filter_ids.some((fid) =>
        selectedCategories.includes(fid)
      );
      if (!hasMatch) return false;
    }

    // Delivery time filter
    if (selectedDeliveryTimes.length > 0) {
      const inRange = selectedDeliveryTimes.some((key) => {
        const [min, max] = DELIVERY_TIME_RANGES[key];
        return (
          restaurant.delivery_time_minutes >= min &&
          restaurant.delivery_time_minutes < max
        );
      });
      if (!inRange) return false;
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      if (!selectedPriceRanges.includes(restaurant.price_range_id))
        return false;
    }

    return true;
  });

  return (
    <MobileSplash>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.layout}>
          <FilterSidebar
            filters={filters}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            selectedDeliveryTimes={selectedDeliveryTimes}
            selectedPriceRanges={selectedPriceRanges}
            onToggleCategory={toggleCategory}
            onToggleDeliveryTime={toggleDeliveryTime}
            onTogglePriceRange={togglePriceRange}
          />
          <main className={styles.main}>
            {/* Mobile delivery time filter */}
            <div className={styles.mobileFilters}>
              <h3 className={styles.mobileFilterTitle}>DELIVERY TIME</h3>
              <div className={styles.mobileFilterPills}>
                {[
                  { label: "0-10 min", value: "0-10" },
                  { label: "10-30 min", value: "10-30" },
                  { label: "30-60 min", value: "30-60" },
                  { label: "1 hour+", value: "60+" },
                ].map((time) => (
                  <button
                    key={time.value}
                    className={`${styles.mobileFilterPill} ${
                      selectedDeliveryTimes.includes(time.value)
                        ? styles.mobileFilterPillActive
                        : ""
                    }`}
                    onClick={() => toggleDeliveryTime(time.value)}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            <CategoryCarousel
              filters={filters}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
            />
            <RestaurantGrid
              restaurants={filteredRestaurants}
            />
          </main>
        </div>
      </div>
    </MobileSplash>
  );
}
