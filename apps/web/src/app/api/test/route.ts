import { getReviewQueue } from "@reviewai/redis";

export async function GET() {
  await getReviewQueue().add("test-review", { hello: "world" });
  return Response.json({ success: true });
}
