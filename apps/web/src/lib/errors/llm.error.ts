import { AppError } from "./base.error";

export class LLMError extends AppError {
  constructor(message = "LLM processing failed") {
    super(message, "LLM_ERROR", 500);
  }
}
