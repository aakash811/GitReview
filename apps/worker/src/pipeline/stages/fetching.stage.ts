import { GithubClient, parseGithubPRUrl } from "@reviewai/github";
import type { PipelineStage } from "../review.pipeline";

export const fetchingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] FETCHING");

  const parsed = parseGithubPRUrl(context.prUrl);

  const client = new GithubClient({
    token: process.env.GITHUB_TOKEN,
  });

  const prMetadata = await client.getPullRequestMetadata(
    parsed.owner,
    parsed.repo,
    parsed.prNumber,
  );

  const rawDiff = await client.getPullRequestDiff(
    parsed.owner,
    parsed.repo,
    parsed.prNumber,
  );

  return {
    ...context,
    status: "fetching",
    prMetadata,
    rawDiff,
  };
};
