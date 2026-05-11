import { z } from "zod";

export const ReviewFormSchema = z.object({
  prUrl: z
    .string()
    .url()
    .regex(
      /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/,
      "Must be a valid GitHub PR URL",
    ),
});

export type ReviewFormValues = z.infer<typeof ReviewFormSchema>;
