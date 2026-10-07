export const API_URL = "http://localhost:5020";

export const TOUR_IMG = `${API_URL}/img/tours/`;
export const USER_IMG = `${API_URL}/img/users/`;

export const formatMonth = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

export const diffStyle = {
  easy: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  difficult: "bg-red-100 text-red-800",
} as const;