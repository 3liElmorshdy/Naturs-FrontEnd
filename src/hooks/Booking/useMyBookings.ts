import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type Tour from "../../types/Tour";

export async function fetchUserBookings(
  signal?: AbortSignal,
): Promise<Tour[]> {
  const response = await api.get("/bookings/my-bookings", signal ? { signal } : undefined);
  const payload =
    response.data?.data?.data ?? response.data?.data ?? response.data;

  if (!Array.isArray(payload)) {
    return [];
  }

  const tours: Tour[] = payload
    .map((item: any) => {
      if (item && typeof item === "object" && "tour" in item && item.tour) {
        return item.tour as Tour;
      }
      return item as Tour;
    })
    .filter((tour): tour is Tour => Boolean(tour && tour._id));

  return tours;
}

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: ({ signal }) => fetchUserBookings(signal),
    staleTime: 2 * 60 * 1000,
  });
};
