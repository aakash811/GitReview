import Groq from "groq-sdk";
import type { DiffChunk } from "@reviewai/github";
import { validateReviewResult, type ReviewResult } from "@reviewai/types";
import type { RepoContext } from "../types/repo-context";
import type { LLMClient } from "./llm.interface";

export class GroqProvider implements LLMClient {
  private readonly client: Groq;

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY");
    }

    this.client = new Groq({
      apiKey,
    });
  }

  async reviewChunk(
    chunk: DiffChunk,
    repoContext: RepoContext,
  ): Promise<ReviewResult> {
    const prompt = `
    You are an expert senior software engineer performing code review.

    Repository:
    ${repoContext.repository}

    Language:
    ${repoContext.language}

    Review the following diff chunk carefully.

    Return ONLY valid JSON.

    Diff:
    ${JSON.stringify(chunk)}
    `;

    const completion = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    console.log("RAW GROQ RESPONSE:", content);

    if (!content) {
      throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(content);

    return validateReviewResult(parsed);
  }
}
