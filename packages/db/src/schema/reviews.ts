import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "fetching",
  "parsing",
  "analyzing",
  "aggregating",
  "complete",
  "failed",
]);

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),

  publicSlug: text("public_slug").notNull(),

  userId: text("user_id"),

  prUrl: text("pr_url").notNull(),

  prMetadata: jsonb("pr_metadata"),

  status: reviewStatusEnum("status").default("pending").notNull(),

  riskLevel: text("risk_level"),

  summary: text("summary"),

  metrics: jsonb("metrics"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  completedAt: timestamp("completed_at"),
});
