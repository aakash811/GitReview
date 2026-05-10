import { db } from "../index";
import { reviews } from "../schema";
import { and, eq, gt } from "drizzle-orm";
import type { ReviewStatus } from "@reviewai/types";
import { findings } from "../schema";

export class ReviewsRepository {
  async createReview(data: {
    prUrl: string;

    userId?: string;

    publicSlug: string;
  }) {
    const [review] = await db
      .insert(reviews)
      .values({
        prUrl: data.prUrl,
        userId: data.userId,
        publicSlug: data.publicSlug,
        status: "pending",
      })
      .returning();

    return review;
  }

  async findRecentReview(prUrl: string) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const review = await db.query.reviews.findFirst({
      where: and(eq(reviews.prUrl, prUrl), gt(reviews.createdAt, yesterday)),
    });

    return review;
  }

  async updateStatus(reviewId: string, status: ReviewStatus) {
    await db
      .update(reviews)
      .set({
        status,
      })
      .where(eq(reviews.id, reviewId));
  }

  async completeReview(
    reviewId: string,
    data: {
      summary: string;
      riskLevel: string;
      metrics: unknown;
    },
  ) {
    await db
      .update(reviews)
      .set({
        status: "complete",
        summary: data.summary,
        riskLevel: data.riskLevel,
        metrics: data.metrics,
        completedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));
  }

  async getReviewById(reviewId: string) {
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!review) {
      return null;
    }

    const reviewFindings = await db.query.findings.findMany({
      where: eq(findings.reviewId, reviewId),
    });

    return {
      ...review,
      findings: reviewFindings,
    };
  }
}
