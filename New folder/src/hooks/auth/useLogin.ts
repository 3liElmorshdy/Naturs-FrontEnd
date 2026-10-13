import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api, { setAccessToken } from "../../services/api";
import { AuthResponse } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Invalid password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post<AuthResponse>("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // refreshToken في httpOnly cookie من الباك
      // accessToken راجع في JSON: خزنه في memory
      setAccessToken(data.accessToken);

      // Response shape: { status, accessToken, data: { user } }
      dispatch(setUser(data.data.user));

      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    },
    onError: (err: any) => {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Login failed. Please try again.";

      if (status === 401 || status === 400) {
        setError("email", { type: "server", message: "" });
        setError("password", {
          type: "server",
          message: "Incorrect email or password.",
        });
        return;
      }

      if (!err.response) {
        setServerError(
          "Connection failed. Please check your internet and try again.",
        );
      } else if (status === 429) {
        setServerError(
          "Too many login attempts. Please wait an hour and try again.",
        );
      } else if (status === 500) {
        setServerError(
          "An internal server error occurred. Please try again later.",
        );
      } else {
        setServerError(message);
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    loginUser(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isPending,
    showPassword,
    togglePassword,
    serverError,
  };
};