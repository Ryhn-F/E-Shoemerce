import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { products } from "./products";
import { productVariants } from "./variants";

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

// Zod validation schemas
export const insertProductImageSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  url: z.string().url("Invalid image URL"),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const selectProductImageSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  url: z.string(),
  sortOrder: z.number(),
  isPrimary: z.boolean(),
  createdAt: z.date(),
});

export type ProductImage = z.infer<typeof selectProductImageSchema>;
export type NewProductImage = z.infer<typeof insertProductImageSchema>;
