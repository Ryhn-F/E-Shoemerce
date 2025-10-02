import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { user, session, account, verification } from "../db";

// Lazy auth instance
let authInstance: ReturnType<typeof betterAuth> | null = null;

function createAuth() {
  // Wait for environment to be available
  if (typeof window !== "undefined") {
    throw new Error("Auth should not be accessed on the client side");
  }

  if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error(
      "BETTER_AUTH_SECRET environment variable is required. Make sure your .env.local file is properly configured."
    );
  }

  if (!process.env.BETTER_AUTH_URL) {
    throw new Error(
      "BETTER_AUTH_URL environment variable is required. Make sure your .env.local file is properly configured."
    );
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user,
        session,
        account,
        verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // MVP: no verification yet
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
    advanced: {
      cookiePrefix: "auth",
      crossSubDomainCookies: {
        enabled: false,
      },
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
  });
}

// Lazy initialization - auth instance is created only when first accessed
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    if (!authInstance) {
      authInstance = createAuth();
    }
    return (authInstance as any)[prop];
  },
});

// Alternative: Explicit async auth getter
export async function getAuth() {
  if (!authInstance) {
    // Ensure we're on server side
    if (typeof window !== "undefined") {
      throw new Error("Auth should not be accessed on the client side");
    }

    // Wait a tick to ensure environment is loaded
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!process.env.BETTER_AUTH_SECRET) {
      throw new Error(
        "BETTER_AUTH_SECRET environment variable is required. Make sure your .env.local file is properly configured."
      );
    }

    if (!process.env.BETTER_AUTH_URL) {
      throw new Error(
        "BETTER_AUTH_URL environment variable is required. Make sure your .env.local file is properly configured."
      );
    }

    authInstance = createAuth();
  }

  return authInstance;
}
