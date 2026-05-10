import { AppError } from "./base.error";

export class GithubApiError extends AppError {
  constructor(message = "Github API request failed") {
    super(message, "GITHUB_API_ERROR", 502);
  }
}
