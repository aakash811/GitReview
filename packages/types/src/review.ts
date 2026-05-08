import { z } from "zod";

export const ReviewStatusSchema = z.enum([
  "pending",
  "fetching",
  "parsing",
  "analyzing",
  "aggregating",
  "complete",
  "failed",
]);

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
