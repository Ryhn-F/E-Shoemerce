import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Zod validation schemas
export const insertSizeSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  slug: z.string().min(1, "Size slug is required"),
  sortOrder: z.number().int().default(0),
});

export const selectSizeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number(),
});

export type Size = z.infer<typeof selectSizeSchema>;
export type NewSize = z.infer<typeof insertSizeSchema>;
