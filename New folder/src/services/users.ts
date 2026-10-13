import api from "./api";
import type User from "../types/User";

interface UpdateMePayload {
  name: string;
}

interface UpdateEmailPayload {
  currentPassword: string;
  email: string;
}

interface UserResponse {
  status: "success";
  data: {
    user: User;
  };
}

interface CheckEmailResponse {
  status: "success";
  data: {
    available: boolean;
  };
}

export async function updateMe(
  payload: UpdateMePayload,
): Promise<User> {
  const response = await api.patch<UserResponse>(
    "/users/updateMe",
    payload,
  );

  return response.data.data.user;
}

export async function uploadPhoto(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.patch<UserResponse>(
    "/users/updateMe",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data.user;
}

export async function updateEmail(payload: {
  currentPassword: string;
  email: string;
  name: string;
}) {
  const response = await api.patch<{
    status: "success";
    message: string;
    data: { user: User };
  }>("/users/updateEmail", payload);

  return {
    user: response.data.data.user,
    message: response.data.message,
  };
}

export async function checkEmailAvailability(
  email: string,
): Promise<boolean> {
  const response = await api.get<CheckEmailResponse>(
    "/users/check-email",
    {
      params: {
        email: email.trim().toLowerCase(),
      },
    },
  );

  return response.data.data.available;
}