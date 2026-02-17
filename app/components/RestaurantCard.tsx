"use client";

import Image from "next/image";
import styles from "./RestaurantCard.module.css";
import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isOpen: boolean | null;
}

function formatDeliveryTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  // Round to nearest 5-min range
  const lower = Math.floor(minutes / 5) * 5;
  const upper = lower + 5;
  return `${lower}-${upper} min`;
}

export default function RestaurantCard({
  restaurant,
  isOpen,
}: RestaurantCardProps) {
  const closed = isOpen === false;

  return (
    <div className={`${styles.card} ${closed ? styles.closed : ""}`}>
      <div className={styles.badges}>
        {isOpen !== null && (
          <span
            className={`${styles.badge} ${
              isOpen ? styles.openBadge : styles.closedBadge
            }`}
          >
            <span
              className={`${styles.dot} ${
                isOpen ? styles.greenDot : styles.blackDot
              }`}
            />
            {isOpen ? "Open" : "Closed"}
          </span>
        )}
        {isOpen && (
          <span className={styles.badge}>
            {formatDeliveryTime(restaurant.delivery_time_minutes)}
          </span>
        )}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          width={160}
          height={160}
          unoptimized
          className={styles.image}
        />
      </div>

      {closed && (
        <div className={styles.closedMessage}>Opens tomorrow at 12 pm</div>
      )}

      <div className={styles.footer}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <button className={styles.arrow} aria-label={`View ${restaurant.name}`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
