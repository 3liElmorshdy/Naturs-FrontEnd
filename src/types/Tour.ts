import type User from "./User";
import type Review from "./Review";

export type TourDifficulty = "easy" | "medium" | "difficult";

export interface TourStartLocation {
  type: "Point" | string;
  coordinates: [number, number];
  address?: string;
  description: string;
}

export interface TourLocation {
  id?: string;
  _id?: string;
  type: "Point" | string;
  coordinates: [number, number];
  description: string;
  day: number;
}

export default interface Tour {
  // MongoDB / Mongoose primary id
  _id: string;

  id?: string;

  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;

  /*
    موجود فقط في endpoint tours-within.
    القيمة تكون بالـ unit المرسل إلى backend:
    mi أو km.
  */
  distance?: number;

  summary: string;
  description?: string;

  imageCover: string;
  images?: string[];

  startDates?: (string | Date)[];
  startLocation?: TourStartLocation;
  locations?: TourLocation[];

  // لو endpoint tours العادي يعمل populate للـ guides:
  guides?: (User | string)[];
  reviews?: Review[];
}