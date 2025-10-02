import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const genders = pgTable("genders", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Zod validation schemas
export const insertGenderSchema = z.object({
  label: z.string().min(1, "Gender label is required"),
  slug: z.string().min(1, "Gender slug is required"),
});

export const selectGenderSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  slug: z.string(),
});

export type Gender = z.infer<typeof selectGenderSchema>;
export type NewGender = z.infer<typeof insertGenderSchema>;
