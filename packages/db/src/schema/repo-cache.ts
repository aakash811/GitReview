import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const repoCache = pgTable("repo_cache", {
  owner: text("owner").notNull(),

  repo: text("repo").notNull(),

  metadata: jsonb("metadata"),

  cachedAt: timestamp("cached_at").defaultNow().notNull(),
});
