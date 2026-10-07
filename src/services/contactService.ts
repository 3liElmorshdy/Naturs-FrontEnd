import api from "./api";

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  status: "success";
  message: string;
}

export async function sendContactMessage(payload: ContactFormPayload) {
  const response = await api.post<ContactResponse>("/contact", payload);
  return response.data;
}