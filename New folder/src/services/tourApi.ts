import api from './api.js';
import type Tour from '../types/Tour.js';
import { CreateTourPayload } from '../types/Tour.js';

export interface ToursApiResponse {
  status: string;
  results?: number;
  data: {
    data?: Tour[];
    tours?: Tour[];
  };
}

export const getAllTours = async (params?: Record<string, unknown>): Promise<Tour[]> => {
  const response = await api.get<ToursApiResponse>('/tours', { params });
  return response.data?.data?.data ?? response.data?.data?.tours ?? [];
};

export default getAllTours;





interface CreateTourResponse {
  status: string;
  data: {
    data: Tour;
  };
}

export interface CreateTourFiles {
  imageCover: File;
  images: File[];
}

export async function createTour(
  payload: Omit<CreateTourPayload, "imageCover" | "images">,
  files: CreateTourFiles,
) {
  const formData = new FormData();

  formData.append("name", payload.name);
  if (payload.slug) formData.append("slug", payload.slug);
  formData.append("duration", String(payload.duration));
  formData.append("maxGroupSize", String(payload.maxGroupSize));
  formData.append("difficulty", payload.difficulty);
  formData.append("price", String(payload.price));
  formData.append("summary", payload.summary);
  formData.append("description", payload.description);

  payload.startDates.forEach((date) => formData.append("startDates", date));
  payload.guides.forEach((guide) => formData.append("guides", guide));

  if (payload.startLocation) {
    formData.append("startLocation[type]", payload.startLocation.type);
    formData.append(
      "startLocation[description]",
      payload.startLocation.description,
    );
    payload.startLocation.coordinates.forEach((coordinate) =>
      formData.append("startLocation[coordinates][]", String(coordinate)),
    );
  }

  formData.append("imageCover", files.imageCover);
  files.images.forEach((image) => formData.append("images", image));

  const response = await api.post<CreateTourResponse>("/tours", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data.data;
}





export async function deleteTour(tourId: string) {
  await api.delete(`/tours/${tourId}`);
}