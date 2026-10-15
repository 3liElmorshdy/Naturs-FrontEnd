import axios from "axios";
import { z } from "zod";
import api from "./api";

const bookedTourSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  duration: z.number(),
  price: z.number(),
  maxGroupSize: z.number().optional(),
  imageCover: z.string().optional(),
  images: z.array(z.string()).optional(),
  startDates: z.array(z.string()).optional(),

  startLocation: z
    .object({
      description: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export const bookingUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  photo: z.string().optional(),
  role: z.string().optional(),
});

export type BookingUser = z.infer<typeof bookingUserSchema>;

export const bookingSchema = z.object({
  _id: z.string(),
  tour: bookedTourSchema.nullable().optional(),
  user: z.union([bookingUserSchema, z.string()]).nullable().optional(),
  price: z.number(),
  createdAt: z.string(),
  paid: z.boolean(),
  startDate: z.string().optional(),
});

const myBookingsResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number(),
  data: z.object({
    data: z.array(bookingSchema),
  }),
});

const singleBookingResponseSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    data: bookingSchema,
  }),
});

export type Booking = z.infer<typeof bookingSchema>;

export async function getMyBookings(
  signal?: AbortSignal,
): Promise<Booking[]> {
  const response = await api.get<unknown>(
    "/bookings/my-bookings",
    signal ? { signal } : undefined,
  );

  const result = myBookingsResponseSchema.safeParse(response.data);

  if (!result.success) {
    console.error("Invalid bookings response:", result.error.issues);

    throw new Error(
      "The server returned unexpected booking data. Please try again.",
    );
  }

  return result.data.data.data;
}

export async function getAllBookings(
  signal?: AbortSignal,
): Promise<Booking[]> {
  const response = await api.get<unknown>(
    "/bookings",
    signal ? { signal } : undefined,
  );

  const result = myBookingsResponseSchema.safeParse(response.data);

  if (!result.success) {
    console.error("Invalid all-bookings response:", result.error.issues);

    throw new Error(
      "The server returned unexpected booking data. Please try again.",
    );
  }

  return result.data.data.data;
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`/bookings/${id}`);
}

export async function updateBooking(
  id: string,
  payload: { paid?: boolean; price?: number },
): Promise<Booking> {
  const response = await api.patch<unknown>(`/bookings/${id}`, payload);
  const result = singleBookingResponseSchema.safeParse(response.data);

  if (!result.success) {
    console.error("Invalid update booking response:", result.error.issues);
    throw new Error("Failed to update booking. Please try again.");
  }

  return result.data.data.data;
}

export async function createBooking(payload: {
  tour: string;
  user: string;
  price: number;
  paid?: boolean;
}): Promise<Booking> {
  const response = await api.post<unknown>("/bookings", payload);
  const result = singleBookingResponseSchema.safeParse(response.data);

  if (!result.success) {
    console.error("Invalid create booking response:", result.error.issues);
    throw new Error("Failed to create booking. Please try again.");
  }

  return result.data.data.data;
}

export function getBookingErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401) {
      return "Please sign in to view your bookings.";
    }

    return (
      error.response?.data?.message ||
      "Unable to load your bookings. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}