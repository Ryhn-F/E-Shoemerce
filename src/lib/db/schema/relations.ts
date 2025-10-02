import { relations } from "drizzle-orm";
import { products } from "./products";
import { productVariants } from "./variants";
import { productImages } from "./product-images";
import { reviews } from "./reviews";
import { categories } from "./categories";
import { brands } from "./brands";
import { genders } from "./filters/genders";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";
import { user } from "./user";

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(reviews),
}));

// Categories relations (already defined in categories.ts, so we skip it here)

// Brands relations
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// Genders relations
export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

// Colors relations
export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

// Sizes relations
export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));

// Product variants relations (already defined in variants.ts)
// Product images relations (already defined in product-images.ts)
// Reviews relations (already defined in reviews.ts)
