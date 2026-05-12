import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

import { reviews } from "./reviews";

export const findings = pgTable("findings", {
  id: uuid("id").defaultRandom().primaryKey(),

  reviewId: uuid("review_id")
    .references(() => reviews.id)
    .notNull(),

  type: text("type").notNull(),

  severity: text("severity").notNull(),

  filePath: text("file_path").notNull(),

  lineStart: integer("line_start").notNull(),

  lineEnd: integer("line_end"),

  title: text("title").notNull(),

  description: text("description").notNull(),

  suggestion: text("suggestion").notNull(),

  confidence: real("confidence"),

  chunkIndex: integer("chunk_index"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  codeSnippet: text("code_snippet"),

  suggestedCode: text("suggested_code"),
});
