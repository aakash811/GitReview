export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getReview(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/report/${slug}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch review");
  }

  return response.json();
}

export default async function ReviewReportPage({ params }: PageProps) {
  const { slug } = await params;

  const review = await getReview(slug);

  const findings = review.findings ?? [];

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">PR Review Report</h1>

        <p className="text-zinc-600">{review.summary}</p>
      </div>

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

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Findings</h2>

        {findings.map((finding: any, index: number) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{finding.title}</h3>

              <span className="text-sm capitalize text-zinc-500">
                {finding.severity}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-600">{finding.description}</p>

            <div className="mt-4 text-sm">
              <p>
                <span className="font-medium">File:</span> {finding.filePath}
              </p>

              <p>
                <span className="font-medium">Line:</span> {finding.lineStart}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm">
              <span className="font-medium">Suggestion:</span>{" "}
              {finding.suggestion}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
