import type { PipelineStage } from "../review.pipeline";
import { FindingsRepository, ReviewsRepository } from "@reviewai/db";

export const completeStage: PipelineStage = async (context) => {
  console.log("[Pipeline] COMPLETE");

  if (!context.aggregatedReview) {
    throw new Error("Missing aggregated review");
  }

  const reviewsRepo = new ReviewsRepository();
  const findingsRepo = new FindingsRepository();

  await reviewsRepo.completeReview(context.reviewId, {
    summary: context.aggregatedReview.summary,
    riskLevel: context.aggregatedReview.riskLevel,
    metrics: context.aggregatedReview.metrics,
  });

  await findingsRepo.createMany(
    context.aggregatedReview.findings.map((findings) => ({
      reviewId: context.reviewId,
      ...findings,
    })),
  );

  return {
    ...context,
    status: "complete",
  };
};
