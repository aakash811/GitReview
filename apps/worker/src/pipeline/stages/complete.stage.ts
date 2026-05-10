import type { PipelineStage } from "../review.pipeline";

export const completeStage: PipelineStage = async (context) => {
  console.log("[Pipeline] COMPLETE");

  console.log(
    "FINAL REVIEW:",
    JSON.stringify(context.aggregatedReview, null, 2),
  );

  return {
    ...context,

    status: "complete",
  };
};
