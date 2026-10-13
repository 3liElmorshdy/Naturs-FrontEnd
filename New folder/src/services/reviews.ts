import api from "./api";
import type Review from "../types/Review";
import type { Rating } from "../types/Review";

export type { Review };

export interface CreateReviewPayload {
  review: string;
  rating: Rating;
}

export const createReview = async (
  tourId: string,
  payload: CreateReviewPayload,
) => {
  const response = await api.post(
    `/tours/${tourId}/reviews`,
    payload,
  );

  return response.data.data.data as Review;
};