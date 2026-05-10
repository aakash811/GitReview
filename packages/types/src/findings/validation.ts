import { z } from "zod";

import { ReviewResultSchema } from "./review.schema";

export function validateReviewResult(data: unknown) {
  const result = ReviewResultSchema.safeParse(data);

  if (!result.success) {
    console.error("ZOD VALIDATION ERROR:", z.treeifyError(result.error));
  }

  return result;
}
