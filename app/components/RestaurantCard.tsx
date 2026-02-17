"use client";

import Image from "next/image";
import styles from "./RestaurantCard.module.css";
import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
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
}: RestaurantCardProps) {
  const isOpen = restaurant.is_open ?? null;
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
          className={styles.image}
        />
      </div>

      {closed && (
        <div className={styles.closedMessage}>Opens tomorrow at 12 pm</div>
      )}

      <div className={styles.footer}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <button className={styles.arrow} aria-label={`View ${restaurant.name}`}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="#00703A"/>
            <path d="M21.6836 16C21.6836 16.1771 21.6107 16.3333 21.4648 16.4688L17.4336 20.4922C17.2982 20.6224 17.1445 20.6875 16.9727 20.6875C16.8008 20.6875 16.6549 20.6302 16.5352 20.5156C16.4206 20.401 16.3633 20.2552 16.3633 20.0781C16.3633 19.9948 16.3763 19.9141 16.4023 19.8359C16.4336 19.7578 16.4779 19.6927 16.5352 19.6406L17.6133 18.5234L20.2539 16.1484L20.3945 16.4844L18.3164 16.6328H10.9414C10.7539 16.6328 10.6029 16.5729 10.4883 16.4531C10.3737 16.3333 10.3164 16.1823 10.3164 16C10.3164 15.8177 10.3737 15.6667 10.4883 15.5469C10.6029 15.4271 10.7539 15.3672 10.9414 15.3672H18.3164L20.3945 15.5156L20.2539 15.8594L17.6133 13.4766L16.5352 12.3594C16.4779 12.3073 16.4336 12.2422 16.4023 12.1641C16.3763 12.0859 16.3633 12.0052 16.3633 11.9219C16.3633 11.7448 16.4206 11.599 16.5352 11.4844C16.6549 11.3698 16.8008 11.3125 16.9727 11.3125C17.1445 11.3125 17.2982 11.3776 17.4336 11.5078L21.4648 15.5312C21.6107 15.6667 21.6836 15.8229 21.6836 16Z" fill="white"/>
          </svg>

          {/* <svg
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
          </svg> */}
        </button>
      </div>
    </div>
  );
}
