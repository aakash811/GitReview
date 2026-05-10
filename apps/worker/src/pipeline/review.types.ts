import type { DiffChunk, PullRequestMetadata } from "@reviewai/github";
import { ReviewStatus } from "@reviewai/types/src/review";

export interface ReviewJobPayload {
  reviewId: string;
  prUrl: string;
  userId?: string;
}

export interface PipelineContext {
  reviewId: string;
  prUrl: string;
  userId?: string;
  status: ReviewStatus;
  prMetadata?: PullRequestMetadata;
  rawDiff?: string;
  parsedChunk?: DiffChunk[];
  findings?: unknown[];
  summary?: string;
  riskLevel?: string;
  error?: string;
}
