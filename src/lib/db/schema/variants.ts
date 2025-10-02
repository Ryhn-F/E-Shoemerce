import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { products } from "./products";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  colorId: uuid("color_id")
    .notNull()
    .references(() => colors.id),
  sizeId: uuid("size_id")
    .notNull()
    .references(() => sizes.id),
  inStock: integer("in_stock").notNull().default(0),
  weight: real("weight"),
  dimensions: jsonb("dimensions").$type<{
    length?: number;
    width?: number;
    height?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
    size: one(sizes, {
      fields: [productVariants.sizeId],
      references: [sizes.id],
    }),
  })
);

// Zod validation schemas
const dimensionsSchema = z
  .object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  })
  .optional();

export const insertProductVariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1, "SKU is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  salePrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid sale price format")
    .optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0).default(0),
  weight: z.number().positive().optional(),
  dimensions: dimensionsSchema,
});

export const selectProductVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string(),
  price: z.string(),
  salePrice: z.string().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number(),
  weight: z.number().nullable(),
  dimensions: dimensionsSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductVariant = z.infer<typeof selectProductVariantSchema>;
export type NewProductVariant = z.infer<typeof insertProductVariantSchema>;
