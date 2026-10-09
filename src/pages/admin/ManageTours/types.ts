export type TourFormState = {
  name: string;
  slug: string;
  duration: string;
  maxGroupSize: string;
  difficulty: "easy" | "medium" | "difficult";
  price: string;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  guides: string[];

  startLocationDescription: string;
  startLocationLongitude: string;
  startLocationLatitude: string;
};