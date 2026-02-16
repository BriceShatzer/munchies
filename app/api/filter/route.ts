import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { FiltersResponse } from "@/lib/types";

export async function GET() {
  try {
    const { data } = await fetchWithCache<FiltersResponse>(
      "/filter",
      "filters:all"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
