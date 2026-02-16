import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { PriceRange } from "@/lib/types";

export async function GET() {
  try {
    const { data } = await fetchWithCache<PriceRange[]>(
      "/price-range",
      "price-range:all"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching price ranges:", error);
    return NextResponse.json(
      { error: "Failed to fetch price ranges" },
      { status: 500 }
    );
  }
}
