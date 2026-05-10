import type { PipelineContext } from "./review.types";
import { fetchingStage } from "./stages/fetching.stage";
import { parsingStage } from "./stages/parsing.stage";
import { analyzingStage } from "./stages/analyzing.stage";
import { aggregatingStage } from "./stages/aggregating.stage";
import { completeStage } from "./stages/complete.stage";

export type PipelineStage = (
  context: PipelineContext,
) => Promise<PipelineContext>;

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
  let context = initialContext;

  for (const stage of stages) {
    context = await stage(context);
  }

  return context;
}
