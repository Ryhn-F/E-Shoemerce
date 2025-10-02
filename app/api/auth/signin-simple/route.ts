import { NextRequest, NextResponse } from "next/server";
import { getDatabase, authSchema } from "@/src/lib/db/connection";
import { createTokenPair } from "@/src/lib/auth/tokens";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Find user by email
    const users = await db
      .select()
      .from(authSchema.user)
      .where(eq(authSchema.user.email, email))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token pair
    const tokenPair = createTokenPair({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken: tokenPair.accessToken,
      expiresIn: tokenPair.expiresIn,
    });

    // Set tokens in httpOnly cookies
    response.cookies.set("better-auth.access-token", tokenPair.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.expiresIn,
      path: "/",
    });

    response.cookies.set("better-auth.refresh-token", tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.expiresIn,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Simple signin error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
