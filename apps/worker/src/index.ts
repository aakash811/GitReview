import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

import { Worker } from "bullmq";

import { getRedis } from "@reviewai/redis";

console.log("Worker service started");

const worker = new Worker(
  "review-queue",

  async (job) => {
    console.log("Processing job:", job.id);

    console.log("Job data:", job.data);

    return {
      success: true,
    };
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
