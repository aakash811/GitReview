import { GENERATED_FILE_PATTERNS, LOCK_FILES } from "./diff.constants";

import type { ChangeType, DiffChunk, Hunk, HunkLine } from "./diff.types";

import { estimateTokens } from "../utils/token-estimator";

export class DiffParser {
  parse(diff: string): DiffChunk[] {
    const files = diff.split(/^diff --git/m);

    const chunks: DiffChunk[] = [];

    for (const rawFile of files) {
      if (!rawFile.trim()) {
        continue;
      }

      const parsed = this.parseFile(rawFile);

      if (parsed) {
        chunks.push(parsed);
      }
    }

    return chunks;
  }

  private parseFile(rawFile: string): DiffChunk | null {
    const lines = rawFile.split("\n");

    const header = lines[0];

    const match = header.match(/a\/(.+?) b\/(.+)/);

    if (!match) {
      return null;
    }

    const [, , newFileName] = match;

    const fileName = newFileName.trim();

    if (this.shouldSkipFile(fileName)) {
      return {
        fileName,

        fileType: this.getFileExtension(fileName),

        changeType: "modified",

        additions: 0,

        deletions: 0,

        hunks: [],

        tokenEstimate: 0,

        skipped: true,

        skipReason: "non_reviewable_file",
      };
    }

    const hunks = this.parseHunks(lines);

    const additions = hunks.reduce((count, hunk) => {
      return count + hunk.lines.filter((line) => line.type === "add").length;
    }, 0);

    const deletions = hunks.reduce((count, hunk) => {
      return count + hunk.lines.filter((line) => line.type === "delete").length;
    }, 0);

    const content = hunks
      .flatMap((hunk) => hunk.lines)
      .map((line) => line.content)
      .join("\n");

    return {
      fileName,

      fileType: this.getFileExtension(fileName),

      changeType: this.detectChangeType(lines),

      additions,

      deletions,

      hunks,

      tokenEstimate: estimateTokens(content),
    };
  }

  private parseHunks(lines: string[]): Hunk[] {
    const hunks: Hunk[] = [];

    let currentHunk: Hunk | null = null;

    for (const line of lines) {
      if (line.startsWith("@@")) {
        if (currentHunk) {
          hunks.push(currentHunk);
        }

        const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);

        if (!match) {
          continue;
        }

        currentHunk = {
          oldStart: Number(match[1]),

          oldLines: Number(match[2] || 1),

          newStart: Number(match[3]),

          newLines: Number(match[4] || 1),

          lines: [],
        };

        continue;
      }

      if (!currentHunk) {
        continue;
      }

      let parsedLine: HunkLine;

      if (line.startsWith("+")) {
        parsedLine = {
          type: "add",
          content: line.slice(1),
        };
      } else if (line.startsWith("-")) {
        parsedLine = {
          type: "delete",
          content: line.slice(1),
        };
      } else {
        parsedLine = {
          type: "context",
          content: line.startsWith(" ") ? line.slice(1) : line,
        };
      }

      currentHunk.lines.push(parsedLine);
    }

    if (currentHunk) {
      hunks.push(currentHunk);
    }

    return hunks;
  }

  private shouldSkipFile(fileName: string): boolean {
    if (LOCK_FILES.some((lockFile) => fileName.endsWith(lockFile))) {
      return true;
    }

    if (GENERATED_FILE_PATTERNS.some((pattern) => fileName.includes(pattern))) {
      return true;
    }

    return false;
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.split(".");

    return parts.length > 1 ? `.${parts.pop()}` : "unknown";
  }

  private detectChangeType(lines: string[]): ChangeType {
    if (lines.some((line) => line.includes("new file mode"))) {
      return "added";
    }

    if (lines.some((line) => line.includes("deleted file mode"))) {
      return "deleted";
    }

    return "modified";
  }
}
