import { DiffParser, GithubClient } from "@reviewai/github";

export async function GET() {
  const client = new GithubClient({
    token: process.env.GITHUB_TOKEN,
  });

  const diff = await client.getPullRequestDiff("facebook", "react", 31000);

  const parser = new DiffParser();

  const parsed = parser.parse(diff);

  return Response.json(parsed);
}
