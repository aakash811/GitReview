import type { PipelineStage } from "../review.pipeline";

export const aggregatingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] AGGREGATING");

  return {
    ...context,
    status: "aggregating",
    summary: "Review completed successfully",
    riskLevel: "low",
  };
};
