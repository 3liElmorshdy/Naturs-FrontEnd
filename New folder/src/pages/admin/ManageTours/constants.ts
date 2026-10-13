import type { TourFormState } from "./types";

export const MAX_GALLERY_IMAGES = 3;

export function createInitialForm(): TourFormState {
  return {
    name: "",
    slug: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "easy",
    price: "",
    summary: "",
    description: "",
    imageCover: "",
    images: [""],
    startDates: [""],
    guides: [],
    startLocationDescription: "",
    startLocationLongitude: "",
    startLocationLatitude: "",
  };
}