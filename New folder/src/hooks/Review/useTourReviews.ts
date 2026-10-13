import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type { Review } from "../../services/reviews";

export const useTourReviews = (tourId?: string) => {
  return useQuery({
    queryKey: ["tour-reviews", tourId],

    queryFn: async () => {
      const response = await api.get(`/tours/${tourId}/reviews`);

      return response.data.data.data as Review[];
    },

    enabled: Boolean(tourId),
  });
};