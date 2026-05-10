import { DiffParser } from "@reviewai/github";
import type { PipelineStage } from "../review.pipeline";
import { ReviewsRepository } from "@reviewai/db";

export const parsingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] PARSING");
  const reviewsRepo = new ReviewsRepository();
  await reviewsRepo.updateStatus(context.reviewId, "parsing");

  if (!context.rawDiff) {
    throw new Error("Missing raw diff");
  }

  const parser = new DiffParser();
  const parsedChunks = parser.parse(context.rawDiff);

  return {
    ...context,
    status: "parsing",
    parsedChunks,
  };
};
