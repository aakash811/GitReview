"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
const stages = [
  "pending",
  "fetching",
  "parsing",
  "analyzing",
  "aggregating",
  "complete",
];

export default function ReviewLoadingPage() {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("id");
  const slug = routeParams.slug as string;
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!reviewId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/review/${reviewId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        setStatus(data.status);

        if (data.status === "complete") {
          clearInterval(interval);

          router.push(`/review/${slug}`);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reviewId, router, slug]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 shadow-2xl backdrop-blur">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400">
            AI Review Pipeline
          </div>

          <h1 className="text-5xl font-bold text-white">
            Reviewing Pull Request
          </h1>

          <p className="mt-4 text-lg text-zinc-400">
            The AI worker is analyzing your PR using distributed queue
            processing.
          </p>
        </div>

        <div className="space-y-5">
          {stages.map((stage, index) => {
            const active = stages.indexOf(stage) <= stages.indexOf(status);

            const current = status === stage;

            return (
              <div
                key={stage}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                  active
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                {current && (
                  <div className="absolute inset-0 animate-pulse bg-emerald-500/5" />
                )}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-4 w-4 rounded-full ${
                        active ? "bg-emerald-400" : "bg-zinc-700"
                      }`}
                    />

                    <div>
                      <p className="text-lg font-semibold capitalize text-white">
                        {stage}
                      </p>

                      <p className="text-sm text-zinc-400">
                        Pipeline stage {index + 1}
                      </p>
                    </div>
                  </div>

                  {current && (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
