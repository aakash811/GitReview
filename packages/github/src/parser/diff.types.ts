export type ChangeType = "added" | "deleted" | "modified";

export interface HunkLine {
  type: "add" | "delete" | "context";
  content: string;
}

export interface Hunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: HunkLine[];
}

export interface DiffChunk {
  fileName: string;
  fileType: string;
  changeType: ChangeType;
  additions: number;
  deletions: number;
  hunks: Hunk[];
  tokenEstimate: number;
  skipped?: boolean;
  skipReason?: string;
}
