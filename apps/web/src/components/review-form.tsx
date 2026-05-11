"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReviewFormSchema,
  type ReviewFormValues,
} from "@/lib/validations/review.schema";
import { useState } from "react";

export function ReviewForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

      const response = await fetch("/api/review", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        alert(`${data.code}: ${data.message}`);

        return;
      }

      router.push(`/review/${data.publicSlug}/status?id=${data.reviewId}`);
    } catch {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="https://github.com/facebook/react/pull/31000"
          {...register("prUrl")}
          className="w-full rounded-lg border p-3"
        />

        {errors.prUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.prUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Starting Review..." : "Review PR"}
      </button>
    </form>
  );
}
