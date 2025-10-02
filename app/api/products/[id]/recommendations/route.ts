import { NextRequest, NextResponse } from "next/server";
import { getRecommendedProducts } from "@/src/lib/actions/product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch fresh recommendations (no caching)
    const recommendations = await getRecommendedProducts(id);

    return NextResponse.json(recommendations, {
      headers: {
        // Disable caching for fresh recommendations
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
