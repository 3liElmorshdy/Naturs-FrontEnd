import api from "./api";
import type { User } from "../types/User";
import Tour, { CreateTourPayload } from "../types/Tour";

type GetAllUsersResponse = {
  status: "success";
  results: number;
  data: {
    data: User[];
  };
};

export async function getAllUsers() {
  const response = await api.get<GetAllUsersResponse>("/users");

  return {
    users: response.data.data.data,
    results: response.data.results,
  };
}
export async function deleteSpecificUser(userId: string) {
  await api.delete(`/users/${userId}`);
}


export async function getSpecificUser(userId: string) {
  const response = await api.get(`/users/${userId}`);

  return response.data.data.data;
}



type CreateTourResponse = {
  status: "success";
  data: {
    data: Tour;
  };
};

export async function createTour(payload: CreateTourPayload) {
  const response = await api.post<CreateTourResponse>(
    "/tours",
    payload,
  );

  return response.data.data.data;
}
export async function getTourGuides() {
  const response = await api.get<GetAllUsersResponse>("/users");

  return response.data.data.data.filter(
    (user) =>
      user.role === "guide" ||
      user.role === "lead-guide",
  );
}