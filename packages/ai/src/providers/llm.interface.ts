import type { DiffChunk } from "@reviewai/github";
import type { ReviewResult } from "@reviewai/types";
import type { RepoContext } from "../types/repo-context";

export interface LLMClient {
  reviewChunk(
    chunk: DiffChunk,
    repoContext: RepoContext,
  ): Promise<ReviewResult>;
}
