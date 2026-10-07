import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating.").max(5),

  review: z
    .string()
    .trim()
    .min(1, "Please write your review.")
    .min(10, "Your review must be at least 10 characters.")
    .max(500, "Your review must be 500 characters or less."),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
