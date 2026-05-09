import { CACHE_TTL, CacheKeys, getRedis } from "@reviewai/redis";
import type { RepoMetaData } from "../client/github.types";
import { GithubClient } from "../client/github.client";

export class RepoCacheService {
  constructor(private readonly githubClient: GithubClient) {}

  async getRepoMetadata(owner: string, repo: string): Promise<RepoMetaData> {
    const redis = getRedis();

    const cacheKey = CacheKeys.repoMetadata(owner, repo);
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`[RepoCache] HIT -> ${cacheKey}`);

      return JSON.parse(cached);
    }

    console.log(`[RepoCache] MISS -> ${cacheKey}`);

    const metadata = await this.githubClient.getRepoMetadata(owner, repo);

    await redis.set(
      cacheKey,
      JSON.stringify(metadata),
      "EX",
      CACHE_TTL.REPO_METADATA,
    );

    return metadata;
  }
}
