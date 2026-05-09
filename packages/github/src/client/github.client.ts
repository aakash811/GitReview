import { GithubAPIError, GithubRateLimitError } from "./github.errors";
import { PullRequestMetadata, RepoMetaData } from "./github.types";

interface GithubClientConfig {
  token?: string;
}

export class GithubClient {
  private readonly baseUrl = "https://api.github.com";
  private readonly token?: string;

  constructor(config?: GithubClientConfig) {
    this.token = config?.token;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,

      headers: {
        Accept: "application/vnd.github+json",

        ...(this.token && {
          Authorization: `Bearer ${this.token}`,
        }),

        ...options?.headers,
      },
    });
    if (response.status === 429) {
      throw new GithubRateLimitError();
    }

    if (!response.ok) {
      throw new GithubAPIError(
        `Github API request failed: ${response.statusText}`,
        response.status,
      );
    }

    return response.json();
  }

  async getPullRequestMetadata(
    owner: string,
    repo: string,
    prNumber: number,
  ): Promise<PullRequestMetadata> {
    const data = await this.request<any>(
      `/repos/${owner}/${repo}/pulls/${prNumber}`,
    );

    return {
      id: data.id,
      title: data.title,
      body: data.body,
      state: data.state,
      author: data.user?.login ?? "unknown",
      labels: data.labels.map((label: any) => label.name),
      changedFiles: data.changed_files,
      additions: data.additions,
      deletions: data.deletions,
      baseSha: data.base.sha,
      headSha: data.head.sha,
    };
  }

  async getPullRequestDiff(
    owner: string,
    repo: string,
    prNumber: number,
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Accept: "application/vnd.github.v3.diff",
          ...(this.token && {
            Authorization: `Bearer ${this.token}`,
          }),
        },
      },
    );

    if (!response.ok) {
      throw new GithubAPIError(
        "Failed to fetch pull request diff",
        response.status,
      );
    }

    return response.text();
  }

  async getRepoMetadata(owner: string, repo: string): Promise<RepoMetaData> {
    const data = await this.request<any>(`/repos/${owner}/${repo}`);

    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      primaryLanguage: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      defaultBranch: data.default_branch,
    };
  }

  async getRepoFileTree(owner: string, repo: string, branch: string) {
    return this.request<any>(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    );
  }
}
