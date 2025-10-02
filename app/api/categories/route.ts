import { NextResponse } from "next/server";
import { db } from "@/src/lib/db/index-simple";
import { categories } from "@/src/lib/db/schema";
import { mockCategories } from "@/src/lib/mock-data";

export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      const allCategories = await db.select().from(categories);
      return NextResponse.json(allCategories);
    } catch (dbError) {
      console.warn("Database connection failed, using mock data:", dbError);
      return NextResponse.json(mockCategories);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
