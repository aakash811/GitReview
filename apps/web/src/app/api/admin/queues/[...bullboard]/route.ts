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

async function handler(req: NextRequest): Promise<Response> {
  return new Promise<Response>((resolve) => {
    const mockRes: any = {
      headers: {},

      setHeader(name: string, value: string) {
        this.headers[name] = value;
      },

      write(chunk: string) {
        this.body = (this.body || "") + chunk;
      },

      end(chunk?: string) {
        if (chunk) {
          this.write(chunk);
        }

        resolve(
          new Response(this.body || "", {
            status: 200,
            headers: this.headers,
          }),
        );
      },
    };

    router(req as any, mockRes, () => {});
  });
}

export const GET = handler;
export const POST = handler;
