import { NextRequest, NextResponse } from "next/server";
import { getDatabase, authSchema } from "@/src/lib/db/connection";
import { createTokenPair } from "@/src/lib/auth/tokens";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(authSchema.user)
      .where(eq(authSchema.user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = crypto.randomUUID();
    const newUser = await db
      .insert(authSchema.user)
      .values({
        id: userId,
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
      })
      .returning();

    if (!newUser[0]) {
      throw new Error("Failed to create user");
    }

    // Create JWT token pair
    const tokenPair = createTokenPair({
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
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
    console.error("Simple signup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
