"use client";

import styles from "./RestaurantGrid.module.css";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "@/lib/types";

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({
  restaurants,
}: RestaurantGridProps) {
  // Sort: open restaurants first, then closed
  const sorted = [...restaurants].sort((a, b) => {
    if (a.is_open === b.is_open) return 0;
    if (a.is_open) return -1;
    if (b.is_open) return 1;
    return 0;
  });

  return (
    <section>
      <h2 className={styles.heading}>Restaurant&apos;s</h2>
      <div className={styles.grid}>
        {sorted.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </section>
  );
}
