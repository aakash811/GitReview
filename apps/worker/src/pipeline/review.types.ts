import type { DiffChunk, PullRequestMetadata } from "@reviewai/github";
import { ChunkReview, ReviewStatus } from "@reviewai/types";
import { AggregatedReview } from "../aggregators/review.aggregator";

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
  parsedChunks?: DiffChunk[];
  findings?: ChunkReview[];
  summary?: string;
  riskLevel?: string;
  error?: string;
  aggregatedReview?: AggregatedReview;
}
