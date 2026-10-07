import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const confirmPasswordSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(1, "Please enter your current password."),
});

type ConfirmPasswordFormData = z.infer<typeof confirmPasswordSchema>;

interface ConfirmPasswordModalProps {
  title: string;
  description: string;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: (currentPassword: string) => void;

  /*
    Optional:
    استخدمه لو عندك setter للـ backend error في parent.
    عند الكتابة الجديدة سنمسح error القديم.
  */
  onClearError?: () => void;
}

export function ConfirmPasswordModal({
  title,
  description,
  isLoading,
  errorMessage,
  onClose,
  onConfirm,
  onClearError,
}: ConfirmPasswordModalProps) {
  const dialogRef = useRef<HTMLFormElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ConfirmPasswordFormData>({
    resolver: zodResolver(confirmPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
    },
  });

  const currentPassword = watch("currentPassword");

  /*
    Zod error له أولوية لأنه error مباشر في الـ field.
    لو Zod لا يملك error، نظهر رسالة الـ backend.
  */
  const fieldError = errors.currentPassword?.message || errorMessage;

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  /*
    عندما backend يقول إن password خطأ:
    - نمسح القيمة الحساسة من input
    - نُبقي modal مفتوحًا ليحاول المستخدم مرة أخرى
  */
  useEffect(() => {
    if (errorMessage) {
      reset({ currentPassword: "" });
      passwordInputRef.current?.focus();
    }
  }, [errorMessage, reset]);

  /*
    Escape يغلق الـ modal فقط طالما لا يوجد request جارٍ.
  */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, onClose]);

  function handleTabKey(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(","),
    );

    const elements = Array.from(focusableElements);

    if (elements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function handlePasswordChange() {
    /*
      لو user بدأ يكتب مرة ثانية بعد رسالة مثل:
      "Your current password is incorrect."
      نمسح error الخاص بالـ server من parent.
    */
    if (errorMessage) {
      onClearError?.();
    }
  }

  function onSubmit(data: ConfirmPasswordFormData) {
    if (isLoading) {
      return;
    }

    onConfirm(data.currentPassword);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <form
        ref={dialogRef}
        onKeyDown={handleTabKey}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-password-title"
        aria-describedby="confirm-password-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
      >
        <h2
          id="confirm-password-title"
          className="text-xl font-bold text-slate-800 dark:text-white"
        >
          {title}
        </h2>

        <p
          id="confirm-password-description"
          className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
        >
          {description}
        </p>

        <label
          htmlFor="current-password"
          className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Current password
        </label>

        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          disabled={isLoading}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={
            fieldError ? "current-password-error" : undefined
          }
          className={[
            "mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-700",
            fieldError
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-400"
              : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-600",
          ].join(" ")}
          {...register("currentPassword", {
            onChange: handlePasswordChange,
          })}
          ref={(element) => {
            register("currentPassword").ref(element);
            passwordInputRef.current = element;
          }}
        />

        {fieldError && (
          <p
            id="current-password-error"
            role="alert"
            className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400"
          >
            {fieldError}
          </p>
        )}

        <Link
          to="/forgot-password"
          onClick={onClose}
          className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
        >
          Forgot your password?
        </Link>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading || !currentPassword?.trim()}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}