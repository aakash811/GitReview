import { rateLimit } from "./rate-limit";

export async function checkRateLimit(identifier: string) {
  const result = await rateLimit.limit(identifier);

  if (!result.success) {
    return {
      success: false,
      response: Response.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: result.reset,
          limit: result.limit,
          remaining: result.remaining,
        },
        { status: 429 },
      ),
    };
  }

  return {
    success: true,
  };
}
