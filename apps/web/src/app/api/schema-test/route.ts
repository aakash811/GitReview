import { validateReviewResult } from "@reviewai/types";

export async function GET() {
  const result = validateReviewResult({
    summary: "Potential performance issue detected.",

    overallRiskScore: 6,

    findings: [
      {
        type: "performance",

        severity: "medium",

        title: "Unnecessary array allocation",

        description: "A new array is created inside a loop.",

        suggestion: "Move allocation outside loop.",

        filePath: "src/utils/parser.ts",

        lineStart: 42,

        lineEnd: 45,

        confidence: 0.91,
      },
    ],
  });

  return Response.json(result);
}
