import { NextRequest } from "next/server";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { getReviewQueue } from "@reviewai/redis";

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/api/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(getReviewQueue())],
  serverAdapter,
});

const router = serverAdapter.getRouter();

async function handler(req: NextRequest) {
  return new Promise((resolve) => {
    router(req as any, {} as any, (result: any) => {
      resolve(result);
    });
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
