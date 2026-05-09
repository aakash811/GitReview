import { GithubClient } from "@reviewai/github";

export async function GET() {
  const client = new GithubClient({
    token: process.env.GITHUB_TOKEN,
  });

  const pr = await client.getPullRequestMetadata("facebook", "react", 31000);
  const diff = await client.getPullRequestDiff("facebook", "react", 31000);

  return Response.json({ pr, diff });
}
