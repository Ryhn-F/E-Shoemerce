import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { user } from "./user";
import { guest } from "./guest";
import { productVariants } from "./variants";

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"), // Changed to text to match Better Auth user IDs
  guestId: text("guest_id"), // Removed foreign key constraint to allow cookie-based guest sessions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  guest: one(guest, {
    fields: [carts.guestId],
    references: [guest.sessionToken],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// Zod validation schemas
export const insertCartSchema = z.object({
  userId: z.string().uuid().optional(),
  guestId: z.string().optional(),
});

export const selectCartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  guestId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertCartItemSchema = z.object({
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export const selectCartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Cart = z.infer<typeof selectCartSchema>;
export type NewCart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof selectCartItemSchema>;
export type NewCartItem = z.infer<typeof insertCartItemSchema>;
