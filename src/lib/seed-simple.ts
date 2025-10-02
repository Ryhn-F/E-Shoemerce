import { execSync } from "child_process";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");
  console.log("🎯 Using raw SQL seed script for better Neon compatibility...");

  try {
    execSync("node scripts/seed-raw.js", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error running seed script:", error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function seedProducts() {
  return seedDatabase();
}
