import { GithubClient, RepoCacheService } from "@reviewai/github";

export async function GET() {
  const githubClient = new GithubClient({
    token: process.env.GITHUB_TOKEN!,
  });

  const repoCache = new RepoCacheService(githubClient);

  const metadata = await repoCache.getRepoMetadata("facebook", "react");

  return Response.json(metadata);
}
