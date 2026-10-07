import api from "./api";
import type { User } from "../types/User";

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