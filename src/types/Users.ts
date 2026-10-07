
import type User from "../types/User";

interface UpdateMePayload {
  name: string;
  email: string;
}

interface UpdateMeResponse {
  status: "success";
  data: {
    user: User;
  };
}

