export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://work-test-web-2024-eze6j4scpq-lz.a.run.app";

export const CACHE_TTL_SECONDS = 5 * 60; // 5 minutes

export const DELIVERY_TIMES: { label: string; value: string; range: [number, number] }[] = [
  { label: "0-10 min", value: "0-10", range: [0, 10] },
  { label: "10-30 min", value: "10-30", range: [10, 30] },
  { label: "30-60 min", value: "30-60", range: [30, 60] },
  { label: "1 hour+", value: "60+", range: [60, Infinity] },
];

export const DELIVERY_TIME_RANGES: Record<string, [number, number]> = Object.fromEntries(
  DELIVERY_TIMES.map(({ value, range }) => [value, range])
);
