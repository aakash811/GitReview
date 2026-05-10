import { ReviewsRepository } from "@reviewai/db";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const repository = new ReviewsRepository();
    const review = await repository.getReviewById(id);

    if (!review) {
      return Response.json(
        {
          error: "Review not found",
        },
        {
          status: 404,
        },
      );
    }

    if (review.status !== "complete") {
      return Response.json({
        reviewId: review.id,
        status: review.status,
      });
    }

    return Response.json({
      reviewId: review.id,
      status: review.status,
      summary: review.summary,
      riskLevel: review.riskLevel,
      metrics: review.metrics,
      findings: review.findings,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Failed to fetch review",
      },
      { status: 500 },
    );
  }
}
