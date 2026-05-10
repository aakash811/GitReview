import { validateReviewResult } from "@reviewai/types";

export function validateLLMResponse(payload: unknown) {
  const result = validateReviewResult(payload);

  return result;
}
