import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import api from "../../services/api";
import type { ForgotPasswordResponse } from "../../types";
import { getRequestErrorMessage } from "../../utils/requestError";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .pipe(z.email("Please enter a valid email address.")),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const RESEND_COOLDOWN_SECONDS = 60;

function useForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const {
    mutate: sendResetLink,
    isPending,
    error,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ForgotPasswordResponse>(
        "/users/forgotPassword",
        { email },
      );

      return response.data;
    },
    onSuccess: (_data, email) => {
      setSubmittedEmail(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
  });

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [cooldown]);

  const onSubmit = (data: ForgotPasswordFormValues) => {
    sendResetLink(data.email.trim().toLowerCase());
  };

  function resend() {
    if (cooldown > 0 || isPending || !submittedEmail) {
      return;
    }

    sendResetLink(submittedEmail);
  }

  function useDifferentEmail() {
    resetMutation();
    setSubmittedEmail("");
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isPending && !submittedEmail,
    isResending: isPending && Boolean(submittedEmail),
    submittedEmail,
    serverError: error ? getRequestErrorMessage(error) : "",
    cooldown,
    resend,
    useDifferentEmail,
  };
}

export default useForgotPassword;