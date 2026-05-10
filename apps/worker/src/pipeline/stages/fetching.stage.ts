import { GithubClient, parseGithubPRUrl } from "@reviewai/github";
import type { PipelineStage } from "../review.pipeline";
import { ReviewsRepository } from "@reviewai/db";

export const fetchingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] FETCHING");

  const reviewsRepo = new ReviewsRepository();
  await reviewsRepo.updateStatus(context.reviewId, "fetching");

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
