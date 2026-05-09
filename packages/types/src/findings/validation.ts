import { z, ZodError } from "zod";

import { ReviewResultSchema, type ReviewResult } from "./review.schema";

export function validateReviewResult(data: unknown): ReviewResult {
  try {
    return ReviewResultSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Review validation failed:", z.treeifyError(error));
    }

    throw error;
  }
}
