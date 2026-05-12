import type { DiffChunk, PullRequestMetadata } from "@reviewai/github";
import { Finding, ReviewStatus } from "@reviewai/types";
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
  findings?: Finding[];
  summary?: string;
  riskLevel?: string;
  error?: string;
  aggregatedReview?: AggregatedReview;
}
