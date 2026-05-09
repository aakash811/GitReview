export class GithubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);

    this.name = "GithubAPIError";
  }
}

export class GithubRateLimitError extends GithubAPIError {
  constructor() {
    super("Github API rate limit exceeded", 429);

    this.name = "GithubRateLimitError";
  }
}
