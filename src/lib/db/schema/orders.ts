import {
  pgTable,
  uuid,
  numeric,
  integer,
  timestamp,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { user } from "./user";
import { addresses } from "./addresses";
import { productVariants } from "./variants";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "stripe",
  "paypal",
  "cod",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "completed",
  "failed",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid("shipping_address_id")
    .notNull()
    .references(() => addresses.id),
  billingAddressId: uuid("billing_address_id")
    .notNull()
    .references(() => addresses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("initiated"),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: "shipping_address",
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: "billing_address",
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// Zod validation schemas
export const insertOrderSchema = z.object({
  userId: z.string().uuid(),
  status: z
    .enum(["pending", "paid", "shipped", "delivered", "cancelled"])
    .default("pending"),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
});

export const selectOrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
  totalAmount: z.string(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

export const selectOrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number(),
  priceAtPurchase: z.string(),
  createdAt: z.date(),
});

export const insertPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(["stripe", "paypal", "cod"]),
  status: z.enum(["initiated", "completed", "failed"]).default("initiated"),
  paidAt: z.date().optional(),
  transactionId: z.string().optional(),
});

export const selectPaymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  method: z.enum(["stripe", "paypal", "cod"]),
  status: z.enum(["initiated", "completed", "failed"]),
  paidAt: z.date().nullable(),
  transactionId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof selectOrderSchema>;
export type NewOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type NewOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Payment = z.infer<typeof selectPaymentSchema>;
export type NewPayment = z.infer<typeof insertPaymentSchema>;
