import type { PipelineStage } from "../review.pipeline";
import { GroqProvider } from "@reviewai/ai";

export const analyzingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] ANALYZING");

  if (!context.parsedChunks?.length) {
    throw new Error("Missing parsed chunks");
  }

  const llm = new GroqProvider(process.env.GROQ_API_KEY);

  const findings = [];

  for (const chunk of context.parsedChunks) {
    const result = await llm.reviewChunk(chunk, {
      repository: context.prMetadata?.title ?? "Unknown",

      language: "TypeScript",

      framework: "React",
    });

    if (result.success) {
      findings.push(result.data);
    } else {
      console.warn("Chunk degraded:", result.reason);
    }
  }

  return {
    ...context,

    status: "analyzing",

    findings,
  };
};
