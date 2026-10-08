import { z } from "zod";

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`);

const positiveNumberFromInput = (
  label: string,
  options: {
    integer?: boolean;
    allowZero?: boolean;
  } = {},
) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => {
      const number = Number(value);

      return Number.isFinite(number);
    }, `${label} must be a valid number.`)
    .refine((value) => {
      const number = Number(value);

      return options.allowZero
        ? number >= 0
        : number > 0;
    }, options.allowZero
      ? `${label} cannot be negative.`
      : `${label} must be greater than zero.`)
    .refine((value) => {
      if (!options.integer) {
        return true;
      }

      return Number.isInteger(Number(value));
    }, `${label} must be a whole number.`);

export const tourFormSchema = z.object({
  name: requiredText("Tour name")
    .min(3, "Tour name must be at least 3 characters.")
    .max(
      100,
      "Tour name cannot exceed 100 characters.",
    ),

  slug: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) {
        return true;
      }

      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
    }, "Slug may contain lowercase letters, numbers, and hyphens only."),

  duration: positiveNumberFromInput("Duration", {
    integer: true,
  }),

  maxGroupSize: positiveNumberFromInput(
    "Maximum group size",
    {
      integer: true,
    },
  ),

  difficulty: z.enum(["easy", "medium", "difficult"]),

  price: positiveNumberFromInput("Price", {
    allowZero: true,
  }),

  summary: requiredText("Summary").min(
    20,
    "Summary must be at least 20 characters.",
  ),

  description: requiredText("Description").min(
    50,
    "Description must be at least 50 characters.",
  ),

  imageCover: requiredText("Cover image").refine(
    (value) =>
      /\.(jpg|jpeg|png|webp)$/i.test(value),
    "Cover image must be an image filename such as .jpg or .png.",
  ),

  images: z
    .array(z.string().trim())
    .refine(
      (images) => images.some(Boolean),
      "Add at least one gallery image.",
    )
    .refine(
      (images) =>
        images
          .filter(Boolean)
          .every((image) =>
            /\.(jpg|jpeg|png|webp)$/i.test(image),
          ),
      "Every gallery image must be an image filename.",
    ),

  startDates: z
    .array(z.string())
    .refine(
      (dates) => dates.some(Boolean),
      "Add at least one start date.",
    )
    .refine(
      (dates) =>
        dates
          .filter(Boolean)
          .every((date) => {
            const parsedDate = new Date(date);

            return !Number.isNaN(parsedDate.getTime());
          }),
      "Every start date must be valid.",
    ),

  guides: z
    .array(z.string())
    .min(1, "Select at least one guide."),

  startLocationDescription: requiredText("Start location description"),

  startLocationLongitude: z
    .string()
    .trim()
    .min(1, "Start location longitude is required.")
    .refine((value) => {
      const number = Number(value);
      return Number.isFinite(number);
    }, "Start location longitude must be a valid number.")
    .refine((value) => {
      const number = Number(value);
      return number >= -180 && number <= 180;
    }, "Longitude must be between -180 and 180."),

  startLocationLatitude: z
    .string()
    .trim()
    .min(1, "Start location latitude is required.")
    .refine((value) => {
      const number = Number(value);
      return Number.isFinite(number);
    }, "Start location latitude must be a valid number.")
    .refine((value) => {
      const number = Number(value);
      return number >= -90 && number <= 90;
    }, "Latitude must be between -90 and 90."),
});

export type TourFormValues = z.infer<
  typeof tourFormSchema
>;