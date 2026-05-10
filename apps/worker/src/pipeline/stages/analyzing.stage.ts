import type { PipelineStage } from "../review.pipeline";

export const analyzingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] ANALYZING");

  return {
    ...context,
    status: "analyzing",
    findings: [],
  };
};
