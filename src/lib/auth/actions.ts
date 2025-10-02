"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "../db/index";
import { guest } from "../db";
import { carts, cartItems } from "../db/schema/carts";
import { auth } from "./config";
import { eq, and } from "drizzle-orm";

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Guest session management
export async function ensureGuestSession() {
  try {
    const existingSession = await getGuestSession();
    if (existingSession) {
      return existingSession;
    }

    const result = await createGuestSession();
    if (result.success) {
      const newSession = await getGuestSession();
      if (newSession) {
        return newSession;
      }
    }

    // If we can't create a guest session, return null instead of throwing
    // This allows the app to continue functioning without guest sessions
    console.warn("Could not create guest session, continuing without one");
    return null;
  } catch (error) {
    console.error("Error in ensureGuestSession:", error);
    // Return null instead of throwing to allow app to continue
    return null;
  }
}

export async function createGuestSession() {
  try {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Temporarily disable database guest sessions due to Neon connection issues
    // TODO: Re-enable once database connection is stable
    console.warn(
      "Guest sessions temporarily disabled due to database connection issues"
    );

    // Set guest session cookie without database storage for now
    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    return { success: true, sessionToken };
  } catch (error) {
    console.error("Failed to create guest session:", error);

    // Check if it's a database connection or table issue
    if (error instanceof Error) {
      if (
        error.message.includes("relation") &&
        error.message.includes("does not exist")
      ) {
        console.error(
          "Guest table does not exist. Run database migrations first."
        );
      } else if (error.message.includes("connect")) {
        console.error(
          "Database connection failed. Check DATABASE_URL environment variable."
        );
      }
    }

    return { success: false, error: "Failed to create guest session" };
  }
}

export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return null;
    }

    // Temporarily return a mock session since database is having issues
    // TODO: Re-enable database lookup once connection is stable
    return {
      id: crypto.randomUUID(),
      sessionToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  } catch (error) {
    console.error("Failed to get guest session:", error);
    return null;
  }
}

export async function clearGuestSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (sessionToken) {
      // Remove from database
      await db.delete(guest).where(eq(guest.sessionToken, sessionToken));

      // Clear cookie
      cookieStore.delete("guest_session");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to clear guest session:", error);
    return { success: false, error: "Failed to clear guest session" };
  }
}

// Authentication actions
export async function signUp(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name || "",
      },
    });

    // Better Auth returns user directly, not in a data wrapper
    if (!result.user) {
      return { success: false, error: "Failed to create account" };
    }

    // Merge guest cart with user account if guest session exists
    await mergeGuestCartWithUserCart(result.user.id);

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Sign up error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function signIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    // Better Auth returns user directly
    if (!result.user) {
      return { success: false, error: "Invalid credentials" };
    }

    // Merge guest cart with user account if guest session exists
    await mergeGuestCartWithUserCart(result.user.id);

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Sign in error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: new Headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

// Guest cart migration
export async function mergeGuestCartWithUserCart(userId: string) {
  try {
    const guestSession = await getGuestSession();

    if (!guestSession) {
      return { success: true, message: "No guest session to merge" };
    }

    // Get guest cart
    const guestCart = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, guestSession.sessionToken))
      .limit(1);

    if (guestCart.length === 0) {
      await clearGuestSession();
      return { success: true, message: "No guest cart to merge" };
    }

    // Get or create user cart
    let userCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    let userCartId: string;
    if (userCart.length === 0) {
      const newCart = await db.insert(carts).values({ userId }).returning();
      userCartId = newCart[0].id;
    } else {
      userCartId = userCart[0].id;
    }

    // Get guest cart items
    const guestCartItems = await db
      .select()
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .where(eq(carts.guestId, guestSession.sessionToken));

    // Merge items into user cart
    for (const guestItem of guestCartItems) {
      // Check if user already has this variant
      const existingUserItem = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, userCartId),
            eq(
              cartItems.productVariantId,
              guestItem.cart_items.productVariantId
            )
          )
        )
        .limit(1);

      if (existingUserItem.length > 0) {
        // Update quantity
        await db
          .update(cartItems)
          .set({
            quantity:
              existingUserItem[0].quantity + guestItem.cart_items.quantity,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existingUserItem[0].id));
      } else {
        // Add new item to user cart
        await db.insert(cartItems).values({
          cartId: userCartId,
          productVariantId: guestItem.cart_items.productVariantId,
          quantity: guestItem.cart_items.quantity,
        });
      }
    }

    // Delete guest cart and items
    await db.delete(carts).where(eq(carts.guestId, guestSession.sessionToken));

    // Clear guest session
    await clearGuestSession();

    console.log(
      `Successfully merged guest cart for session ${guestSession.sessionToken} with user ${userId}`
    );

    return { success: true, message: "Guest cart merged successfully" };
  } catch (error) {
    console.error("Failed to merge guest cart:", error);
    return { success: false, error: "Failed to merge guest cart" };
  }
}

// Redirect helpers for checkout flow
export async function redirectToSignIn(callbackUrl?: string) {
  const url = callbackUrl
    ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/sign-in";
  redirect(url);
}

export async function redirectAfterAuth(callbackUrl?: string) {
  const url = callbackUrl || "/";
  redirect(url);
}
