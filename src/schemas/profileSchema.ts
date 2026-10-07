import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .min(2, "Your name must be at least 2 characters.")
    .max(50, "Your name cannot exceed 50 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .pipe(z.email("Please enter a valid email address.")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
