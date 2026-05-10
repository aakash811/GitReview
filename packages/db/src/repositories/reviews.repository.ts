import { db } from "../index";
import { reviews } from "../schema";
import { and, eq, gt } from "drizzle-orm";
import type { ReviewStatus } from "@reviewai/types";

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
}
