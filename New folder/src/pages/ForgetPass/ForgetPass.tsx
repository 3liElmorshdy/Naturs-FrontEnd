import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

import useForgotPassword from "../../hooks/auth/useForgotPassword";

function ForgetPass() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submittedEmail,
    serverError,
    cooldown,
    isResending,
    resend,
    useDifferentEmail,
  } = useForgotPassword();

  if (submittedEmail) {
    return (
      <main className="mx-auto mt-10 max-w-md p-4">
        <div
          role="status"
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
        >
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Check your inbox
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            If an account exists for{" "}
            <strong className="break-all text-slate-800 dark:text-white">
              {submittedEmail}
            </strong>
            , we've sent a password reset link. It's valid for 10 minutes.
            Don't forget to check your spam folder.
          </p>

          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {serverError}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <button
              type="button"
              onClick={resend}
              disabled={cooldown > 0 || isResending}
              className="font-semibold text-teal-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-teal-400"
            >
              {isResending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend email"}
            </button>

            <button
              type="button"
              onClick={useDifferentEmail}
              className="font-semibold text-slate-600 hover:underline dark:text-slate-300"
            >
              Use a different email
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-10 max-w-md p-4">


      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-xl border bg-slate-50 p-3 text-slate-800 outline-none transition-all dark:bg-slate-700 dark:text-white ${
              errors.email
                ? "border-red-500 ring-1 ring-red-500"
                : "border-slate-300 focus:ring-2 focus:ring-teal-500 dark:border-slate-600"
            }`}
            {...register("email")}
          />

          {errors.email?.message && (
            <span
              id="email-error"
              role="alert"
              className="ml-1 text-xs font-medium text-red-500"
            >
              {errors.email.message}
            </span>
          )}
        </div>

        {serverError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 p-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it?{" "}
        <Link
          to="/login"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Back to sign in
        </Link>
      </p>
    </main>
  );
}

export default ForgetPass;