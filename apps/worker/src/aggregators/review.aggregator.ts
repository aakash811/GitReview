import type { Finding } from "@reviewai/types";

export interface AggregatedReview {
  findings: Finding[];
  riskLevel: "low" | "medium" | "high";
  summary: string;
  metrics: {
    totalFindings: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export class ReviewAggregator {
  aggregate(findings: Finding[]): AggregatedReview {
    const deduplicateFindings = this.deduplicateFindings(findings);
    const metrics = this.calculateMetrics(deduplicateFindings);
    const riskLevel = this.calculateRiskLevel(metrics);
    const summary = this.generateSummary(deduplicateFindings, riskLevel);

    return {
      findings: deduplicateFindings,
      riskLevel,
      summary,
      metrics,
    };
  }

  private deduplicateFindings(findings: Finding[]): Finding[] {
    const map = new Map<string, Finding>();

    for (const finding of findings) {
      const key = [
        finding.filePath,
        finding.lineStart,
        finding.lineEnd,
        finding.title,
      ].join(":");

      if (!map.has(key)) {
        map.set(key, finding);
      }
    }

    return Array.from(map.values());
  }

  private calculateMetrics(findings: Finding[]) {
    return {
      totalFindings: findings.length,
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
    };
  }

  private calculateRiskLevel(metrics: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  }): "low" | "medium" | "high" {
    if (metrics.critical > 0) {
      return "high";
    }

    if (metrics.high >= 3) {
      return "high";
    }

    if (metrics.high > 0 || metrics.medium > 0) {
      return "medium";
    }

    return "low";
  }

  private generateSummary(
    findings: Finding[],
    riskLevel: "low" | "medium" | "high",
  ): string {
    if (!findings.length) {
      return "No significant issues detected.";
    }

    return [
      `Review completed with ${riskLevel} risk level.`,
      `Detected ${findings.length} findings.`,
      `Top categories: ${[...new Set(findings.map((f) => f.type))].join(
        ", ",
      )}.`,
    ].join(" ");
  }
}
