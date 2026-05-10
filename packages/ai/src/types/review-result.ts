import type { ChunkReview } from "@reviewai/types";

export interface ReviewSuccess {
  success: true;
  data: ChunkReview;
}

export interface ReviewFailure {
  success: false;
  degraded: true;
  reason: string;
}

export type ReviewExecutionResult = ReviewSuccess | ReviewFailure;
