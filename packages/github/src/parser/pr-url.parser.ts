import { InvalidGithubPRUrlError } from "./pr-url.errors";
import { ParsedPRUrl } from "../types/pr.types";

const GITHUB_PR_REGEX =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)(\/)?(\?.*)?$/i;

export function parseGithubPRUrl(url: string): ParsedPRUrl {
  if (!url || typeof url !== "string") {
    throw new InvalidGithubPRUrlError("URL must be a non-empty string");
  }

  const trimmedUrl = url.trim();

  const match = trimmedUrl.match(GITHUB_PR_REGEX);

  if (!match) {
    throw new InvalidGithubPRUrlError("Invalid Github PR Url format");
  }

  const [, owner, repo, prNumber] = match;

  if (!owner || !repo || !prNumber) {
    throw new InvalidGithubPRUrlError("Missing required PR URL fields");
  }

  const parsedPRNumber = parseInt(prNumber);

  if (Number.isNaN(parsedPRNumber)) {
    throw new InvalidGithubPRUrlError("Invalid PR Number");
  }

  return {
    owner,
    repo,
    prNumber: parsedPRNumber,
  };
}
