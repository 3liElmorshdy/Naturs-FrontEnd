import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type Tour from "../../types/Tour";

export const useTour = (slug?: string) =>
  useQuery({
    queryKey: ["tour", slug],
    queryFn: async () => {
      const res = await api.get(`/tours/slug/${slug}`);
      return res.data?.data?.data as Tour;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });