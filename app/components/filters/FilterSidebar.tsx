"use client";

import styles from "./FilterSidebar.module.css";
import { Filter, PriceRange } from "@/lib/types";

interface FilterSidebarProps {
  filters: Filter[];
  priceRanges: PriceRange[];
  selectedCategories: string[];
  selectedDeliveryTimes: string[];
  selectedPriceRanges: string[];
  onToggleCategory: (id: string) => void;
  onToggleDeliveryTime: (time: string) => void;
  onTogglePriceRange: (id: string) => void;
}

const DELIVERY_TIMES = [
  { label: "0-10 min", value: "0-10" },
  { label: "10-30 min", value: "10-30" },
  { label: "30-60 min", value: "30-60" },
  { label: "1 hour+", value: "60+" },
];

export default function FilterSidebar({
  filters,
  priceRanges,
  selectedCategories,
  selectedDeliveryTimes,
  selectedPriceRanges,
  onToggleCategory,
  onToggleDeliveryTime,
  onTogglePriceRange,
}: FilterSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filter</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>FOOD CATEGORY</h3>
        <div className={styles.pills}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`${styles.pill} ${
                selectedCategories.includes(filter.id) ? styles.active : ""
              }`}
              onClick={() => onToggleCategory(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>DELIVERY TIME</h3>
        <div className={styles.pills}>
          {DELIVERY_TIMES.map((time) => (
            <button
              key={time.value}
              className={`${styles.pill} ${
                selectedDeliveryTimes.includes(time.value) ? styles.active : ""
              }`}
              onClick={() => onToggleDeliveryTime(time.value)}
            >
              {time.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>PRICE RANGE</h3>
        <div className={styles.pills}>
          {priceRanges.map((range) => (
            <button
              key={range.id}
              className={`${styles.pill} ${
                selectedPriceRanges.includes(range.id) ? styles.active : ""
              }`}
              onClick={() => onTogglePriceRange(range.id)}
            >
              {range.range}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
