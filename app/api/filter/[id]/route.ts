import { NextRequest, NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { Filter } from "@/lib/types";

interface ErrorResponse {
  error: boolean;
  reason: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data } = await fetchWithCache<Filter | ErrorResponse>(
      `/filter/${id}`,
      `filter:${id}`
    );

    // Check if the response is an error
    if ("error" in data && data.error) {
      return NextResponse.json(data, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching filter ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch filter" },
      { status: 500 }
    );
  }
}
