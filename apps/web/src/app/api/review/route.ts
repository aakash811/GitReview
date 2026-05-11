import z from "zod";
import { headers } from "next/headers";
import crypto from "crypto";
import { parseGithubPRUrl } from "@reviewai/github";
import { getReviewQueue } from "@reviewai/redis";
import { ReviewsRepository } from "@reviewai/db";
import { checkRateLimit } from "@/lib/check-rate-limit";
import { handleApiError } from "@/lib/errors/handle-error";

const BodySchema = z.object({
  prUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "anonymous";
    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.success) {
      return rateLimit.response;
    }

    const parsed = BodySchema.parse(body);

    parseGithubPRUrl(parsed.prUrl);

    const repository = new ReviewsRepository();
    const cachedReview = await repository.findRecentReview(parsed.prUrl);

    if (cachedReview && cachedReview.status === "complete") {
      return Response.json({
        reviewId: cachedReview.id,
        publicSlug: cachedReview.publicSlug,
        status: cachedReview.status,
        cached: true,
      });
    }

    const publicSlug = crypto.randomUUID();
    const review = await repository.createReview({
      prUrl: parsed.prUrl,
      publicSlug,
    });

    await getReviewQueue().add("review-pr", {
      reviewId: review.id,
      prUrl: parsed.prUrl,
    });

    return Response.json(
      {
        reviewId: review.id,
        publicSlug,
        status: "pending",
        cached: false,
      },
      {
        status: 202,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
