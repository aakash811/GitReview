import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

import { Worker } from "bullmq";
import { getRedis } from "@reviewai/redis";
import { runReviewPipeline } from "./pipeline/review.pipeline";
import { ReviewJobPayload } from "./pipeline/review.types";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { getReviewQueue } from "@reviewai/redis";

const app = express();

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(getReviewQueue())],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

const PORT = process.env.PORT || 3001;

app.get("/", (_, res) => {
  res.send("ReviewAI Worker Running");
});

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Health server listening on ${PORT}`);
});

console.log("Worker service started");

const worker = new Worker(
  "review-queue",

  async (job) => {
    const payload = job.data as ReviewJobPayload;
    console.log(`Starting review ${payload.reviewId}`);
    console.log("Processing job:", job.id);
    console.log("Job data:", job.data);

    const result = await runReviewPipeline({
      reviewId: payload.reviewId,
      prUrl: payload.prUrl,
      userId: payload.userId,
      status: "pending",
    });

    console.log("Pipeline completed:", result.status);

    return result;
  },

  {
    connection: getRedis(),
    prefix: "bull",
    concurrency: 2,
  },
);

worker.on("ready", () => {
  console.log("Worker ready");
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`);

  console.error(err);
});
