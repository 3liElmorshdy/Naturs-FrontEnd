import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../services/api";
import { SignupResponse } from "../../types";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const useSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // يُخزَّن الإيميل هنا بعد التسجيل الناجح → يُشغّل شاشة "راجع بريدك"
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError, // سنستخدمها لربط خطأ الباك بحقل معين
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    try {
      const response = await api.post<SignupResponse>("/users/signup", data);

      if (response.data.status === "success") {
        // Don't dispatch setUser here — the user must verify their email first.
        // The session cookie is only issued after verification.
        // setUser will be dispatched inside useVerifyEmail on success.
        setRegisteredEmail(data.email);
      }
    } catch (err: any) {
      console.error("Signup error:", err.response?.data);

      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";

      // ─── Input Errors: أخطاء مرتبطة بحقل محدد ───────────────────────────────
      // تُعرض تحت الحقل المعني فقط باللون الأحمر — بدون banner وبدون toast

      // 1. Duplicate field value (E11000 من MongoDB)
      const isDuplicate =
        message.includes("Duplicate field value") ||
        message.includes("E11000") ||
        message.toLowerCase().includes("duplicate") ||
        err.response?.data?.error?.code === 11000;

      if (isDuplicate) {
        const isEmailDuplicate =
          message.toLowerCase().includes("@") ||
          !!err.response?.data?.error?.keyValue?.email;

        if (isEmailDuplicate) {
          // الخطأ يخص حقل Email → يظهر تحته فقط
          setError("email", {
            type: "server",
            message: "This email is already registered. Try logging in.",
          });
        } else {
          // الخطأ يخص حقل Name → يظهر تحته فقط
          setError("name", { type: "server", message: "name already exists " });
        }
        return; // لا banner، لا toast
      }

      // 2. Mongoose Validation Error (مثلاً passwordConfirm)
      if (
        message.includes("Validator failed for path") ||
        message.includes("validation failed")
      ) {
        if (message.includes("passwordConfirm")) {
          setError("passwordConfirm", {
            type: "server",
            message: "Passwords do not match.",
          });
          return; // يظهر تحت الحقل فقط
        }
        // أخطاء validation أخرى لا ترتبط بحقل → banner
        setServerError("Validation failed. Please check your inputs.");
        return;
      }

      // ─── Global Errors: أخطاء عامة لا ترتبط بحقل ────────────────────────────
      // تُعرض في الـ Banner فقط (500، network، session، إلخ)

      if (!err.response) {
        // No response = network issue
        setServerError(
          "Connection failed. Please check your internet and try again.",
        );
      } else if (status === 429) {
        setServerError(
          "Too many signup attempts. Please wait an hour and try again.",
        );
      } else if (status === 500) {
        setServerError(
          "An internal server error occurred. Please try again later.",
        );
      } else {
        // أي خطأ آخر غير مُصنَّف → banner
        setServerError(message);
      }
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    serverError,
    registeredEmail,
  };
};