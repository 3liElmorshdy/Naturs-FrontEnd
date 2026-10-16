import { API_ORIGIN } from "../config";
export const API_URL = API_ORIGIN;

export const TOUR_IMG = `${API_URL}/img/tours/`;
export const USER_IMG = `${API_URL}/img/users/`;

export const getTourImageSrc = (img?: string): string => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/")) return `${API_URL}${img}`;
  return `${TOUR_IMG}${img}`;
};

export const getUserImageSrc = (img?: string): string => {
  if (!img || img === "default.jpg") return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/")) return `${API_URL}${img}`;
  return `${USER_IMG}${img}`;
};



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