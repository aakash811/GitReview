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
        console.log("Polling status:", data.status);
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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Reviewing Pull Request</h1>

          <p className="mt-2 text-zinc-600">
            AI pipeline is processing your PR.
          </p>
        </div>

        <div className="space-y-4">
          {stages.map((stage) => {
            const active = stages.indexOf(stage) <= stages.indexOf(status);

            return (
              <div
                key={stage}
                className={`rounded-lg border p-4 ${
                  active ? "border-black bg-zinc-100" : "border-zinc-200"
                }`}
              >
                <p className="capitalize">{stage}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
