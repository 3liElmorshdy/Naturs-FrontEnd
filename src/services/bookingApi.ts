import api from "./api";

export type BookingTour = {
  _id: string;
  name: string;
  slug: string;
  duration: number;
  price: number;
  imageCover: string;
  startDates?: string[];
  startLocation?: {
    description?: string;
  };
};

export type Booking = {
  _id: string;
  tour: BookingTour;
  user: string;
  price: number;
  paid: boolean;
  createdAt: string;
  startDate?: string;
};

type GetMyBookingsResponse = {
  status: "success";
  results: number;
  data: {
    data: Booking[];
  };
};

export async function getMyBookings(): Promise<Booking[]> {
  const response = await api.get<GetMyBookingsResponse>(
    "/bookings/my-bookings",
  );

  return response.data.data.data;
}