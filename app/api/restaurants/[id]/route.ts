import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { Restaurant } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data } = await fetchWithCache<Restaurant>(
      `/restaurants/${encodeURIComponent(id)}`,
      `restaurant:${id}`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    );
  }
}
