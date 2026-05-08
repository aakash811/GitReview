import { Queue } from "bullmq";
import { getRedis } from "../client";

let _reviewQueue: Queue | null = null;

export function getReviewQueue(): Queue {
  if (!_reviewQueue) {
    _reviewQueue = new Queue("review-queue", {
      connection: getRedis(),
      prefix: "bull",
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });
  }
  return _reviewQueue;
}
