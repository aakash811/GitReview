CREATE TYPE "public"."review_status" AS ENUM('pending', 'fetching', 'parsing', 'analyzing', 'aggregating', 'complete', 'failed');--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"file_path" text NOT NULL,
	"line_start" integer,
	"line_end" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"suggestion" text,
	"confidence" real,
	"chunk_index" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_slug" text NOT NULL,
	"user_id" text,
	"pr_url" text NOT NULL,
	"pr_metadata" jsonb,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"risk_level" text,
	"summary" text,
	"metrics" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "repo_cache" (
	"owner" text NOT NULL,
	"repo" text NOT NULL,
	"metadata" jsonb,
	"cached_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;