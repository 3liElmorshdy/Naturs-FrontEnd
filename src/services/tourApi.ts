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

export async function createTour(payload: CreateTourPayload) {
  const response = await api.post<CreateTourResponse>(
    "/tours",
    payload,
  );

  return response.data.data.data;
}




export async function deleteTour(tourId: string) {
  await api.delete(`/tours/${tourId}`);
}