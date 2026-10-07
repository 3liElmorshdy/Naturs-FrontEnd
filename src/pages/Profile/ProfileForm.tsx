import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSchema,
  type ProfileFormData,
} from "../../schemas/profileSchema";

interface ProfileFormProps {
  initialValues: ProfileFormData;
  isEditing: boolean;
  isSaving: boolean;
  message: string;
  errorMessage: string;
  emailError: string;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onClearErrors?: () => void;
}

function getInputClassName(hasError: boolean) {
  return [
    "mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-700",
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-400"
      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-600",
  ].join(" ");
}

export function ProfileForm({
  initialValues,
  isEditing,
  isSaving,
  message,
  errorMessage,
  emailError,
  onEdit,
  onCancel,
  onSubmit,
  onClearErrors,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  /*
    عندما Redux user يتغير بعد نجاح الـ API، نعيد الـ form لقيم user الحالية.
    نعتمد على primitives حتى لا يحدث reset مع كل render.
  */
  useEffect(() => {
    reset({ name: initialValues.name, email: initialValues.email });
  }, [initialValues.name, initialValues.email, reset]);

  /*
    لما المستخدم يكتب من جديد، نمسح رسائل الـ server من الـ parent.
  */
  useEffect(() => {
    if (!onClearErrors) {
      return;
    }

    const subscription = watch((_values, { type }) => {
      if (type === "change") {
        onClearErrors();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onClearErrors]);

  async function handleFormSubmit(data: ProfileFormData) {
    await onSubmit({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    });
  }

  function handleCancel() {
    reset({ name: initialValues.name, email: initialValues.email });
    onCancel();
  }

  const nameError = errors.name?.message;
  const resolvedEmailError = errors.email?.message || emailError;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Profile information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update the information associated with your account.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Edit profile
          </button>
        )}
      </div>

      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          {message}
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="mt-7 space-y-5"
      >
        <div>
          <label
            htmlFor="profile-name"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Full name
          </label>

          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            disabled={!isEditing || isSaving}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "profile-name-error" : undefined}
            className={getInputClassName(Boolean(nameError))}
            {...register("name")}
          />

          {nameError && (
            <p
              id="profile-name-error"
              role="alert"
              className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400"
            >
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Email address
          </label>

          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            disabled={!isEditing || isSaving}
            aria-invalid={Boolean(resolvedEmailError)}
            aria-describedby={
              resolvedEmailError ? "profile-email-error" : undefined
            }
            className={getInputClassName(Boolean(resolvedEmailError))}
            {...register("email")}
          />

          {resolvedEmailError && (
            <p
              id="profile-email-error"
              role="alert"
              className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400"
            >
              {resolvedEmailError}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}