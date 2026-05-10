import type { PipelineStage } from "../review.pipeline";

import { ReviewAggregator } from "../../aggregators/review.aggregator";

export const aggregatingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] AGGREGATING");

  const aggregator = new ReviewAggregator();

  const aggregated = aggregator.aggregate(context.findings ?? []);

  return {
    ...context,

    status: "aggregating",

    aggregatedReview: aggregated,
  };
};
