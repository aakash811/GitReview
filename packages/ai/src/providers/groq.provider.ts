import Groq from "groq-sdk";
import type { DiffChunk } from "@reviewai/github";
import { validateReviewResult } from "@reviewai/types";
import type { ReviewExecutionResult } from "../types/review-result";
import type { RepoContext } from "../types/repo-context";
import type { LLMClient } from "./llm.interface";
import { buildSystemPrompt, buildUserPrompt } from "../prompts/review.prompt";
import { buildRetryPrompt } from "../prompts/retry.prompt";

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
  ): Promise<ReviewExecutionResult> {
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

    if (!content) {
      return {
        success: false,
        degraded: true,
        reason: "Empty LLM response",
      };
    }

    console.log("RAW GROQ RESPONSE:", content);

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = content;
    }

    const validated = validateReviewResult(parsed);

    if (validated.success) {
      return {
        success: true,
        data: validated.data,
      };
    }

    console.warn("Validation failed. Retrying...");

    const retryCompletion = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      temperature: 0,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: "You are a strict JSON repair system.",
        },

        {
          role: "user",
          content: buildRetryPrompt(content),
        },
      ],
    });

    const retryContent = retryCompletion.choices[0]?.message?.content;

    if (!retryContent) {
      return {
        success: false,
        degraded: true,
        reason: "Retry returned empty response",
      };
    }

    console.log("RETRY RESPONSE:", retryContent);

    let retryParsed: unknown;

    try {
      retryParsed = JSON.parse(retryContent);
    } catch {
      retryParsed = retryContent;
    }

    const retryValidated = validateReviewResult(retryParsed);

    if (retryValidated.success) {
      return {
        success: true,
        data: retryValidated.data,
      };
    }

    console.error("Chunk degraded after retry");

    return {
      success: false,
      degraded: true,
      reason: "Validation failed after retry",
    };
  }
}
