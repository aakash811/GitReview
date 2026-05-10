import { getReviewQueue } from "@reviewai/redis";

export async function GET() {
  await getReviewQueue().add("review-job", {
    reviewId: crypto.randomUUID(),

    prUrl: "https://github.com/facebook/react/pull/31000",
  });

  return Response.json({
    success: true,
  });
}
