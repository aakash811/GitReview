export interface PullRequestMetadata {
  id: number;
  title: string;
  body: string | null;
  state: string;
  author: string;
  labels: string[];
  changedFiles: number;
  additions: number;
  deletions: number;
  baseSha: string;
  headSha: string;
}

export interface RepoMetaData {
  name: string;
  fullName: string;
  description: string | null;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  defaultBranch: string;
}
