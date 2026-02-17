"use client";

import { useState, useEffect } from "react";
import styles from "./MobileSplash.module.css";

export default function MobileSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    if (mq.matches) {
      setShowSplash(true);
    }
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile && showSplash) {
    return (
      <div className={styles.splash}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 22C8 22 6 22 6 20C6 18 8 14 16 14C24 14 26 18 26 20C26 22 24 22 24 22H8Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 26H26"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 10C12 8 13 6 16 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M16 10C16 8 17 6 20 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className={styles.logoText}>Munchies</span>
          </div>

          <div className={styles.heroText}>
            <h1 className={styles.display}>
              Treat
              <br />
              yourself.
            </h1>
            <p className={styles.subtitle}>
              Find the best restaurants in your city and get it delivered to your
              place!
            </p>
          </div>

          <button
            className={styles.continueBtn}
            onClick={() => setShowSplash(false)}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
