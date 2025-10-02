import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod validation schemas
export const insertCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  slug: z.string().min(1, "Collection slug is required"),
});

export const selectCollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Collection = z.infer<typeof selectCollectionSchema>;
export type NewCollection = z.infer<typeof insertCollectionSchema>;
