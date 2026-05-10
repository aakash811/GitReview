import { PipelineStage } from "../review.pipeline";

export const completeStage: PipelineStage = async (context) => {
  console.log("[Pipeline] COMPLETE");

  return {
    ...context,
    status: "complete",
  };
};
