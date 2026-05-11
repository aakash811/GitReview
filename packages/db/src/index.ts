import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

import postgres from "postgres";

import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, {
  schema,
});

export * from "./repositories/reviews.repository";
export * from "./repositories/findings.repository";
