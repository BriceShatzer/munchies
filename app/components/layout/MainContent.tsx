"use client";

import { useState, useCallback } from "react";
import styles from "./MainContent.module.css";
import Header from "./Header";
import FilterSidebar from "../filters/FilterSidebar";
import CategoryCarousel from "../filters/CategoryCarousel";
import RestaurantGrid from "../restaurant/RestaurantGrid";
import MobileSplash from "../MobileSplash";
import { Restaurant, Filter, PriceRange } from "@/lib/types";
import { DELIVERY_TIMES, DELIVERY_TIME_RANGES } from "@/lib/config";

interface MainContentProps {
  restaurants: Restaurant[];
  filters: Filter[];
  priceRanges: PriceRange[];
}

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
                {DELIVERY_TIMES.map((time) => (
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
