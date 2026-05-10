import Groq from "groq-sdk";
import type { DiffChunk } from "@reviewai/github";
import { validateReviewResult, type ReviewResult } from "@reviewai/types";
import type { RepoContext } from "../types/repo-context";
import type { LLMClient } from "./llm.interface";
import { buildSystemPrompt, buildUserPrompt } from "../prompts/review.prompt";

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
    const systemPrompt = buildSystemPrompt(repoContext);
    const userPrompt = buildUserPrompt(chunk, repoContext);

    const completion = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
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
