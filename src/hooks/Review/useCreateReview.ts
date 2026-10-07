import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  type CreateReviewPayload,
  type Review,
} from "../../services/reviews";

export const useCreateReview = (tourId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      createReview(tourId, payload),

    onSuccess: async (newReview) => {
      queryClient.setQueryData<Review[]>(
        ["tour-reviews", tourId],
        (oldReviews = []) => [newReview, ...oldReviews],
      );

      await queryClient.invalidateQueries({
        queryKey: ["tour-reviews", tourId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["tour"],
      });
    },
  });
};      