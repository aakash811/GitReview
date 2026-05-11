import { ReviewsRepository } from "@reviewai/db";

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
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">PR Review Report</h1>

        <p className="text-zinc-600">{review.summary}</p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Risk Level</p>

            <h2 className="text-3xl font-bold capitalize">
              {review.riskLevel}
            </h2>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Status</p>

            <p className="capitalize">{review.status}</p>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Findings</h2>

          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm">
            {findings.length} findings
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="rounded-xl border p-6 text-zinc-600">
            No findings detected.
          </div>
        ) : (
          findings.map((finding: any, index: number) => (
            <div key={index} className="rounded-xl border p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{finding.title}</h3>

                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize">
                  {finding.severity}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-600">
                {finding.description}
              </p>

              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium">File:</span> {finding.filePath}
                </p>

                <p>
                  <span className="font-medium">Line:</span> {finding.lineStart}
                </p>

                <p>
                  <span className="font-medium">Type:</span> {finding.type}
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm">
                <span className="font-medium">Suggestion:</span>{" "}
                {finding.suggestion}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
