import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { AuthResponse, } from "../../types";

export const useVerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      if (!token) throw new Error("link is not valid");
      const res = await api.post<AuthResponse>(`/users/verifyEmail/${token}`);
      // console.log(res.data);
      // console.log(token);
      return res.data;
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/login"), 1000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // هندلة الخطأ "العادية" والبسيطة جداً (مؤقتاً لحد ما نعمل الـ Global File)
  let errorMessage = null;
  if (isError) {
    const err = error as any; // تبسيط الـ Type
    errorMessage =
      err.response?.data?.message ||
      err.message ||
      "link is not valid";
  }

  const status = isLoading ? "loading" : isSuccess ? "success" : "error";

  return { status, errorMessage };
};
