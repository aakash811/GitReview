import type { PipelineContext } from "./review.types";

import { fetchingStage } from "./stages/fetching.stage";
import { parsingStage } from "./stages/parsing.stage";
import { analyzingStage } from "./stages/analyzing.stage";
import { aggregatingStage } from "./stages/aggregating.stage";
import { completeStage } from "./stages/complete.stage";

import { ReviewsRepository } from "@reviewai/db";
import { pipeline } from "stream";

export type PipelineStage = (
  context: PipelineContext,
) => Promise<PipelineContext>;

const reviewsRepository = new ReviewsRepository();

const stages: PipelineStage[] = [
  fetchingStage,
  parsingStage,
  analyzingStage,
  aggregatingStage,
  completeStage,
];

export async function runReviewPipeline(
  initialContext: PipelineContext,
): Promise<PipelineContext> {
  const pipelineStartedAt = Date.now();
  let context = initialContext;

  for (const stage of stages) {
    const stageName = stage.name.replace("Stage", "");
    const startedAt = Date.now();

    console.log({
      event: "stage_started",
      stage: stageName,
      reviewId: context.reviewId,
    });

    context = await stage(context);

    const duration = Date.now() - startedAt;

    console.log({
      event: "stage_completed",
      stages: stageName,
      reviewId: context.reviewId,
      durationMs: duration,
    });

    await reviewsRepository.updateStatus(context.reviewId, context.status);
  }

  const totalDuration = Date.now() - pipelineStartedAt;

  console.log({
    event: "review_completed",
    reveiwId: context.reviewId,
    totalDurationMs: totalDuration,
  });

  if (totalDuration > 30000) {
    console.warn({
      event: "slow_review_warning",
      reviewId: context.reviewId,
      totalDurationMs: totalDuration,
    });
  }

  return context;
}
