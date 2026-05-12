import { ReviewsRepository } from "@reviewai/db";
import { CopyLinkButton } from "@/components/copy-link-button";
import { ReviewMetrics } from "@/components/review-metrics";
import { ReviewFindings } from "@/components/review-findings";
import { RiskBadge } from "@/components/risk-badge";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const reviewsRepo = new ReviewsRepository();

async function getReview(slug: string) {
  const review = await reviewsRepo.findBySlug(slug);

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
}

export default async function ReviewReportPage({ params }: PageProps) {
  const { slug } = await params;

  const review = await getReview(slug);

  const findings = review.findings ?? [];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-30 -top-30 h-105 w-105 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-35 -right-25 h-105 w-105 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Top nav */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-black shadow-lg shadow-emerald-500/30">
              R
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">ReviewAI</p>

              <p className="text-sm text-zinc-500">AI Pull Request Reviewer</p>
            </div>
          </div>

          <CopyLinkButton />
        </div>

        {/* Hero */}
        <div className="overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-zinc-800 p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
                  AI Review Completed
                </div>

                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Pull Request Review Report
                </h1>

                <p className="mt-5 text-lg leading-8 text-zinc-400">
                  {review.summary}
                </p>
              </div>

              <div className="grid min-w-70 gap-4">
                {/* Risk */}
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                  <p className="text-sm text-zinc-500">Risk Level</p>

                  <div className="mt-3 flex items-center gap-3">
                    <RiskBadge level={review.riskLevel ?? "low"} />
                  </div>
                </div>

                {/* Status */}
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                  <p className="text-sm text-zinc-500">Review Status</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                    <span className="text-xl font-semibold capitalize">
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Findings */}
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                  <p className="text-sm text-zinc-500">Findings</p>

                  <h2 className="mt-3 text-4xl font-bold">{findings.length}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="p-8 md:p-10">
            <ReviewMetrics
              metrics={
                review.metrics as {
                  totalFindings: number;
                  critical: number;
                  high: number;
                  medium: number;
                  low: number;
                }
              }
            />
          </div>
        </div>

        {/* Findings */}
        <div className="mt-10">
          <ReviewFindings findings={findings} />
        </div>
      </div>
    </main>
  );
}
