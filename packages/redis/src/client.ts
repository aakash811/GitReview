import IORedis from "ioredis";

let _redis: IORedis | null = null;

export function getRedis(): IORedis {
  if (!_redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not set");
    }

    console.log("Creating Redis connection...");

    _redis = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,

      tls: {},
    });

    _redis.on("connect", () => {
      console.log("Redis connected");
    });

    _redis.on("ready", () => {
      console.log("Redis ready");
    });

    _redis.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  return _redis;
}
