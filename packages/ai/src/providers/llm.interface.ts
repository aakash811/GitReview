import type { DiffChunk } from "@reviewai/github";
import type { RepoContext } from "../types/repo-context";
import { ReviewExecutionResult } from "../types/review-result";

export interface LLMClient {
  reviewChunk(
    chunk: DiffChunk,
    repoContext: RepoContext,
  ): Promise<ReviewExecutionResult>;
}
