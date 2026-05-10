import z from "zod";
import { parseGithubPRUrl } from "@reviewai/github";
import { getReviewQueue } from "@reviewai/redis";
import { ReviewsRepository } from "@reviewai/db";
import crypto from "crypto";
import { cache } from "react";

const BodySchema = z.object({
  prUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = BodySchema.parse(body);
    parseGithubPRUrl(parsed.prUrl);

    const repository = new ReviewsRepository();
    const cachedReview = await repository.findRecentReview(parsed.prUrl);

    if (cachedReview) {
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
    console.log(error);

    return Response.json(
      {
        error: "Failed to create review",
      },
      {
        status: 500,
      },
    );
  }
}
