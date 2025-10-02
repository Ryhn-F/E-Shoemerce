import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, createAccessToken } from "@/src/lib/auth/tokens";
import { getDatabase, authSchema } from "@/src/lib/db/connection";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("better-auth.refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // For now, we'll use the access token to get user info
    // In a more robust system, you'd store refresh tokens in the database
    const accessToken = cookieStore.get("better-auth.access-token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Verify user still exists in database
    const db = getDatabase();
    const users = await db
      .select()
      .from(authSchema.user)
      .where(eq(authSchema.user.id, payload.userId))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const user = users[0];

    // Generate new access token
    const newAccessToken = createAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expiresIn: 60 * 60 * 24 * 365,
    });

    // Set new access token in httpOnly cookie
    response.cookies.set("better-auth.access-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
