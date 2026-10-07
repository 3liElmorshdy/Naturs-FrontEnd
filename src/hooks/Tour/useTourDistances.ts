import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type Tour from "../../types/Tour";
import type { DistanceUnit } from "../../utils/formatDistance";

export interface TourWithDistance extends Tour {
  distance: number;
}

interface UseTourDistancesParams {
  latitude?: number;
  longitude?: number;
  unit?: DistanceUnit;
  enabled?: boolean;
}




export const useTourDistances = ({
  latitude,
  longitude,
  unit = "mi",
  enabled = true,
}: UseTourDistancesParams) => {
  return useQuery({
    queryKey: ["tour-distances", latitude, longitude, unit],

    queryFn: async () => {
      const response = await api.get(
        `/tours/distances/${latitude},${longitude}/unit/${unit}`,
      );

      console.log("Nearby tours response:", response.data);

      // Response:
      // {
      //   status: "success",
      //   results: 9,
      //   data: { data: [...] }
      // }
      return response.data?.data?.data as TourWithDistance[];
    },

    enabled:
      enabled &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude),

    staleTime: 5 * 60 * 1000,
  });
};