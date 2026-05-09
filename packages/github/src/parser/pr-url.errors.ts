export class InvalidGithubPRUrlError extends Error {
  constructor(message = "Invalid GitHub pull request URL") {
    super(message);

    this.name = "InvalidGithubPRUrlError";
  }
}
