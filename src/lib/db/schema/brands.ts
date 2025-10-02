import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod validation schemas
export const insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Brand slug is required"),
  logoUrl: z.string().url().optional(),
});

export const selectBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Brand = z.infer<typeof selectBrandSchema>;
export type NewBrand = z.infer<typeof insertBrandSchema>;
