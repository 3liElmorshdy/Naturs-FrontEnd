import { z } from "zod";

export type BookingStatusFilter = "all" | "paid" | "pending";

export type BookingSortOption =
  | "newest"
  | "oldest"
  | "price-desc"
  | "price-asc";

export type BookingViewMode = "table" | "grid";

export interface BookingStatsData {
  total: number;
  paidCount: number;
  pendingCount: number;
  totalRevenue: number;
}

export const createBookingSchema = z.object({
  tourId: z.string().trim().min(1, "Tour ID is required"),
  userId: z.string().trim().min(1, "User ID is required"),
  price: z
    .number("Price must be a valid number")
    .positive("Price must be greater than 0"),
  paid: z.boolean(),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
