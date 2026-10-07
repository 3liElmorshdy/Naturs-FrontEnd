import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type Tour from "../../types/Tour";

type DistanceUnit = "mi" | "km";

interface UseToursWithinParams {
  distance: number;
  latitude?: number;
  longitude?: number;
  unit?: DistanceUnit;
  enabled?: boolean;
}

export const useToursWithin = ({
  distance,
  latitude,
  longitude,
  unit = "mi",
  enabled = true,
}: UseToursWithinParams) => {
  return useQuery({
    queryKey: ["tours-within", distance, latitude, longitude, unit],

    queryFn: async () => {
      const response = await api.get(
        `/tours/tours-within/${distance}/center/${latitude},${longitude}/unit/${unit}`,
      );

      return response.data?.data?.tours as Tour[];
    },

    enabled:
      enabled &&
      Number.isFinite(distance) &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude),

    staleTime: 5 * 60 * 1000,
  });
};