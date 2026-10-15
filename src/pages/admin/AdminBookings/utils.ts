import { API_ORIGIN } from "../../../config";
import type { Booking, BookingUser } from "../../../services/bookingApi";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getTourImageUrl(imageCover?: string): string {
  if (!imageCover) {
    return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80";
  }
  if (imageCover.startsWith("http://") || imageCover.startsWith("https://")) {
    return imageCover;
  }
  if (imageCover.startsWith("/")) {
    return `${API_ORIGIN}${imageCover}`;
  }
  return `${API_ORIGIN}/img/tours/${imageCover}`;
}

export function extractCustomer(user: Booking["user"]): BookingUser | null {
  if (!user || typeof user === "string") return null;
  return user;
}
