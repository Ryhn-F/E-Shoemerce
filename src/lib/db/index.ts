import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema/index";

// Type for the database instance
type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

// Lazy database instance
let dbInstance: DatabaseInstance | null = null;

// Add connection retry logic
async function createDatabaseWithRetry(
  retries = 3
): Promise<ReturnType<typeof drizzle<typeof schema>>> {
  // Wait for environment to be available

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required. Make sure your .env.local file is properly configured."
    );
  }

  for (let i = 0; i < retries; i++) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });

      await sql`SELECT 1`;

      return db;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
    }
  }

  throw new Error("Failed to establish database connection after retries");
}

function createDatabase() {
  // Wait for environment to be available
  if (typeof window !== "undefined") {
    throw new Error("Database should not be accessed on the client side");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required. Make sure your .env.local file is properly configured."
    );
  }

  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

// Lazy initialization - database connection is created only when first accessed
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    if (!dbInstance) {
      dbInstance = createDatabase();
    }
    return (dbInstance as unknown as Record<string, unknown>)[prop as string];
  },
});

// Export all schemas
export * from "./schema/index";

// Alternative: Explicit async database getter with retry logic
export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await createDatabaseWithRetry();
  }
  return dbInstance;
}

// Helper function to ensure database is initialized
export function ensureDatabaseConnection() {
  if (!dbInstance) {
    dbInstance = createDatabase();
  }
  return dbInstance;
}

// Helper function to wait for database to be ready
export async function waitForDatabase(timeoutMs = 5000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      await getDatabase();
      // Test with a simple query
      const sql = neon(process.env.DATABASE_URL!);
      await sql`SELECT 1`;
      return;
    } catch (error) {
      console.warn("Database not ready, retrying...", error);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Database not ready after ${timeoutMs}ms`);
}
