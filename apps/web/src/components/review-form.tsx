"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReviewFormSchema,
  type ReviewFormValues,
} from "@/lib/validations/review.schema";
import { useState } from "react";

const techTags = [
  "Groq LLM",
  "BullMQ",
  "Redis",
  "AI Code Review",
  "Diff Analysis",
];

export function ReviewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    mode: "onChange",
  });

  async function onSubmit(values: ReviewFormValues) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`${data.code}: ${data.message}`);
        return;
      }

      router.push(`/review/${data.publicSlug}/status?id=${data.reviewId}`);
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 backdrop-blur-sm">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/6 blur-3xl" />

      <div className="relative space-y-7">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            AI Pull Request Reviewer
          </span>
          <span className="h-px flex-1 max-w-[60px] bg-emerald-500/30" />
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-mono text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Review GitHub PRs
            <br />
            <span className="text-emerald-400">with AI</span>
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-500">
            Automated code review powered by LLMs, BullMQ pipelines, and
            intelligent diff analysis.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-600">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10.5 10.5L14 14M1.5 7a5.5 5.5 0 1011 0 5.5 5.5 0 00-11 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="https://github.com/owner/repo/pull/123"
              {...register("prUrl")}
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 pl-10 pr-5 py-3.5 font-mono text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15"
            />
          </div>

          {(errors.prUrl || error) && (
            <p className="flex items-center gap-1.5 font-mono text-xs text-red-400">
              <span>⚠</span>
              {errors.prUrl?.message ?? error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-3.5 font-mono text-sm font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Starting Review…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 8h10M8 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Review Pull Request
              </>
            )}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 font-mono text-[11px] text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
