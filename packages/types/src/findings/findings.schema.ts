import { z } from "zod";

import { FindingTypes, SeverityLevels } from "./findings.types";

export const FindingSchema = z.object({
  type: z.enum(FindingTypes),
  severity: z.enum(SeverityLevels),

  title: z.string().min(5).max(120),
  description: z.string().min(10).max(2000),
  suggestion: z.string().min(5).max(2000),
  filePath: z.string(),

  lineStart: z.number().int().nonnegative(),
  confidence: z.number().min(0).max(1),
});

export type Finding = z.infer<typeof FindingSchema>;
