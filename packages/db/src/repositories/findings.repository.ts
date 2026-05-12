import { db } from "../index";
import { findings } from "../schema";

export class FindingsRepository {
  async createMany(
    data: Array<{
      reviewId: string;
      type: string;
      severity: string;
      title: string;
      description: string;
      suggestion: string;
      filePath: string;
      lineStart: number;
      lineEnd?: number;
      codeSnippet?: string;
      suggestedCode?: string;
      confidence: number;
    }>,
  ) {
    if (!data.length) {
      return;
    }

    await db.insert(findings).values(data);
  }
}
