"use client";

import Image from "next/image";
import styles from "./CategoryCarousel.module.css";
import { Filter } from "@/lib/types";

interface CategoryCarouselProps {
  filters: Filter[];
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
}

export default function CategoryCarousel({
  filters,
  selectedCategories,
  onToggleCategory,
}: CategoryCarouselProps) {
  return (
    <div className={styles.carousel}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.card} ${
            selectedCategories.includes(filter.id) ? styles.selected : ""
          }`}
          onClick={() => onToggleCategory(filter.id)}
        >
          <span className={styles.name}>{filter.name}</span>
          <div className={styles.imageWrapper}>
            <Image
              src={filter.image_url}
              alt={filter.name}
              width={80}
              height={80}
              unoptimized
            />
          </div>
        </button>
      ))}
    </div>
  );
}
