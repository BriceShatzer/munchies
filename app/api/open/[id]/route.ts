import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/api-client";
import { OpenStatusResponse } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data } = await fetchWithCache<OpenStatusResponse>(
      `/open/${encodeURIComponent(id)}`,
      `open:${id}`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching open status:", error);
    return NextResponse.json(
      { error: true, reason: "Restaurant not found" },
      { status: 404 }
    );
  }
}
