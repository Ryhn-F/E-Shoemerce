// Export auth schemas
export * from "./user";
export * from "./session";
export * from "./account";
export * from "./verification";
export * from "./guest";

// Export eCommerce schemas
export * from "./addresses";
export * from "./brands";
export * from "./categories";
export * from "./collections";
export * from "./products";
export * from "./variants";
export * from "./product-images";
export * from "./reviews";
export * from "./carts";
export * from "./orders";
export * from "./coupons";
export * from "./wishlists";
export * from "./product-collections";

// Export filter schemas
export * from "./filters/genders";
export * from "./filters/colors";
export * from "./filters/sizes";

// Export relations
export * from "./relations";

// Re-export for convenience
import { user } from "./user";
import { session } from "./session";
import { account } from "./account";
import { verification } from "./verification";
import { guest } from "./guest";
import { addresses } from "./addresses";
import { brands } from "./brands";
import { categories } from "./categories";
import { collections } from "./collections";
import { products } from "./products";
import { productVariants } from "./variants";
import { productImages } from "./product-images";
import { reviews } from "./reviews";
import { carts, cartItems } from "./carts";
import { orders, orderItems, payments } from "./orders";
import { coupons } from "./coupons";
import { wishlists } from "./wishlists";
import { productCollections } from "./product-collections";
import { genders } from "./filters/genders";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";

export const authSchemas = {
  user,
  session,
  account,
  verification,
  guest,
};

export const ecommerceSchemas = {
  addresses,
  brands,
  categories,
  collections,
  products,
  productVariants,
  productImages,
  reviews,
  carts,
  cartItems,
  orders,
  orderItems,
  payments,
  coupons,
  wishlists,
  productCollections,
  genders,
  colors,
  sizes,
};
