import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api, { setAccessToken } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthResponse } from "../../types";
import { setUser } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type ResetPasswordFormValues = z.infer<typeof resetSchema>;

export const useResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      const response = await api.patch<AuthResponse>(
        `/users/resetPassword/${token}`,
        {
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      // الباك رجّع accessToken + حط refreshToken cookie جديدة
      setAccessToken(data.accessToken);
      dispatch(setUser(data.data.user));

      toast.success("Password reset successfully");
      navigate("/", { replace: true });
    },

    onError: (error: any) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (!error.response) {
        toast.error(
          "Connection failed. Please check your internet and try again.",
        );
      } else if (status === 429) {
        toast.error("Too many attempts. Please wait and try again.");
      } else if (status === 500) {
        toast.error(
          "An internal server error occurred. Please try again later.",
        );
      } else {
        // 400: token invalid/expired
        toast.error(message || "Something went wrong. Please try again.");
      }
    },
  });

  const onSubmit = handleSubmit((data) => resetMutation.mutate(data));

  return {
    register,
    onSubmit,
    errors,
    isSubmitting,
  };
};