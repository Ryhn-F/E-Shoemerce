import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  hexCode: text("hex_code").notNull(),
});

// Zod validation schemas
export const insertColorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  slug: z.string().min(1, "Color slug is required"),
  hexCode: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color code"),
});

export const selectColorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  hexCode: z.string(),
});

export type Color = z.infer<typeof selectColorSchema>;
export type NewColor = z.infer<typeof insertColorSchema>;
