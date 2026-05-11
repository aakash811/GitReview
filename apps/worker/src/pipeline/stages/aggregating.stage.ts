import type { PipelineStage } from "../review.pipeline";
import { ReviewAggregator } from "../../aggregators/review.aggregator";
import { ReviewsRepository } from "@reviewai/db";

export const aggregatingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] AGGREGATING");

  const reviewsRepo = new ReviewsRepository();
  await reviewsRepo.updateStatus(context.reviewId, "aggregating");

  const aggregator = new ReviewAggregator();

  const aggregated = aggregator.aggregate(context.findings ?? []);

  return {
    ...context,
    status: "aggregating",
    aggregatedReview: aggregated,
  };
};
