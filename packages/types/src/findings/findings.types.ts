export const FindingTypes = [
  "bug",
  "security",
  "performance",
  "maintainability",
  "style",
] as const;

export type FindingType = (typeof FindingTypes)[number];

export const SeverityLevels = ["low", "medium", "high", "critical"] as const;

export type SeverityLevel = (typeof SeverityLevels)[number];
