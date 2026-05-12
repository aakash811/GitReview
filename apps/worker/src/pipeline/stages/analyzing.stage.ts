import type { PipelineStage } from "../review.pipeline";
import { GroqProvider } from "@reviewai/ai";
import { ReviewsRepository } from "@reviewai/db";

export const analyzingStage: PipelineStage = async (context) => {
  console.log("[Pipeline] ANALYZING");

  if (!context.parsedChunks?.length) {
    throw new Error("Missing parsed chunks");
  }

  const reviewsRepo = new ReviewsRepository();
  await reviewsRepo.updateStatus(context.reviewId, "analyzing");

  const llm = new GroqProvider(process.env.GROQ_API_KEY);

  const findings = [];

  for (const chunk of context.parsedChunks) {
    const result = await llm.reviewChunk(chunk, {
      repository: context.prMetadata?.title ?? "Unknown",
      language: "TypeScript",
      framework: "React",
    });

    if (result.success) {
      const findingData = result.data.findings.map((finding: any) => ({
        ...finding,
        codeSnippet: chunk.codeSnippet,
        lineEnd: chunk.endLine,
      }));
      findings.push(...findingData);
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
