import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
]);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: numeric("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  maxUsage: integer("max_usage").notNull(),
  usedCount: integer("used_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod validation schemas
export const insertCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid discount value format"),
  expiresAt: z.date(),
  maxUsage: z.number().int().min(1),
  usedCount: z.number().int().min(0).default(0),
});

export const selectCouponSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.string(),
  expiresAt: z.date(),
  maxUsage: z.number(),
  usedCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Coupon = z.infer<typeof selectCouponSchema>;
export type NewCoupon = z.infer<typeof insertCouponSchema>;
