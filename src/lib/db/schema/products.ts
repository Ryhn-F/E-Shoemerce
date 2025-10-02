import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { categories } from "./categories";
import { genders } from "./filters/genders";
import { brands } from "./brands";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  genderId: uuid("gender_id")
    .notNull()
    .references(() => genders.id),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
  isPublished: boolean("is_published").default(false).notNull(),
  defaultVariantId: uuid("default_variant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod validation schemas
export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().default(false),
  defaultVariantId: z.string().uuid().optional(),
});

export const selectProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean(),
  defaultVariantId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;
