import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import type Review from "../../types/Review";
import type { Rating } from "../../types/Review";
interface UpdateReviewParams {
  reviewId: string;
  tourId: string;
  rating?: Rating;
  review?: string;
}

export function useEditReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-review"],

    mutationFn: async ({
      reviewId,
      rating,
      review,
    }: UpdateReviewParams) => {
      const body: Record<string, unknown> = {};

      if (rating !== undefined) {
        body.rating = rating;
      }

      if (review !== undefined) {
        body.review = review.trim();
      }

      const response = await api.patch(
        `/reviews/${reviewId}`,
        body,
      );

      return response.data.data.data as Review;
    },

    onSuccess: async (updatedReview, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tour-reviews", variables.tourId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["tour"],
        }),
      ]);

      console.log("Review updated:", updatedReview._id);
    },

    onError: (error) => {
      console.error("Failed to update review:", error);
    },
  });
}

export default useEditReview;