import { z } from "zod";
import { FindingSchema } from "./finding.schema";

export const ReviewResultSchema = z.object({
  summary: z.string().min(10).max(3000),
  overallRiskScore: z.number().min(0).max(10),
  findings: z.array(FindingSchema),
});
export type ReviewResult = z.infer<typeof ReviewResultSchema>;
