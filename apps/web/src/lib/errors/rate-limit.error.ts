import { AppError } from "./base.error";

export class RataLLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}
