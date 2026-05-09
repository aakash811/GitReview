import { parseGithubPRUrl } from "@reviewai/github";

export async function GET() {
  const parsed = parseGithubPRUrl(
    "https://github.com/facebook/react/pull/31000",
  );

  return Response.json(parsed);
}
