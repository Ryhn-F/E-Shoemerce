import { NextResponse } from "next/server";
import { db } from "@/src/lib/db/index";
import { genders, colors, sizes } from "@/src/lib/db/schema";
import { mockGenders, mockColors, mockSizes } from "@/src/lib/mock-data";

export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      const [allGenders, allColors, allSizes] = await Promise.all([
        db.select().from(genders),
        db.select().from(colors),
        db.select().from(sizes).orderBy(sizes.sortOrder),
      ]);

      return NextResponse.json({
        genders: allGenders,
        colors: allColors,
        sizes: allSizes,
      });
    } catch (dbError) {
      console.warn("Database connection failed, using mock data:", dbError);
      return NextResponse.json({
        genders: mockGenders,
        colors: mockColors,
        sizes: mockSizes.sort((a, b) => a.sortOrder - b.sortOrder),
      });
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
