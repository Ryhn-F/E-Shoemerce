import { NextResponse } from "next/server";
import { db } from "@/src/lib/db/index";
import { brands } from "@/src/lib/db/schema";
import { mockBrands } from "@/src/lib/mock-data";

export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      const allBrands = await db.select().from(brands);
      return NextResponse.json(allBrands);
    } catch (dbError) {
      console.warn("Database connection failed, using mock data:", dbError);
      return NextResponse.json(mockBrands);
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
