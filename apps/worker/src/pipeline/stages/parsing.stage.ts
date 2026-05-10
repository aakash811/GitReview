import { DiffParser } from "@reviewai/github";
import type { PipelineStage } from "../review.pipeline";

export const parsingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] PARSING");

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
