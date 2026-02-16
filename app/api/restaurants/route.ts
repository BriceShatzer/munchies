import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { RestaurantsResponse } from "@/lib/types";

export async function GET() {
  try {
    const { data } = await fetchWithCache<RestaurantsResponse>(
      "/restaurants",
      "restaurants:all"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
