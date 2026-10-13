import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "../../schemas/reviewSchema";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useCreateReview } from "../../hooks/Review/useCreateReview";
import type { RootState } from "../../store/store";
import type { Review } from "../../services/reviews";
import type { Rating } from "../../types/Review";

interface ReviewFormProps {
  tourId: string;
  tourSlug: string;
  reviews: Review[];
}

// ─── Not logged in ────────────────────────────────────────────────────────────
function SignInPrompt({ tourSlug }: { tourSlug: string }) {
  return (
    <section
      aria-label="Sign in to review"
      className="mt-8 "
    >
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
  <div className="flex items-start gap-4">
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
      aria-hidden="true"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h8M8 14h5m7-2a8 8 0 01-8 8 8.4 8.4 0 01-3.6-.8L4 20l.8-3.4A8 8 0 1112 20"
        />
      </svg>
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Have you taken this tour?
      </h3>

      <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        Sign in to share your experience and help other travelers decide.
      </p>

      <Link
        to={`/login?redirect=/tours/${tourSlug}`}
        className="mt-4 inline-flex items-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        Sign in to leave a review
      </Link>
    </div>
  </div>
</div>
    </section>
  );
}

// ─── Interactive star picker ──────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: Rating;
  onChange: (v: Rating) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-label="Select rating">
      {([1, 2, 3, 4, 5] as Rating[]).map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={star === value}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <span
            className={
              star <= (hovered || value)
                ? "text-amber-400"
                : "text-slate-300 dark:text-slate-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReviewForm({
  tourId,
  tourSlug,
  reviews,
}: ReviewFormProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { rating: 5, review: "" },
  });

  const rating = watch("rating") as Rating;
  const reviewText = watch("review") ?? "";

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useCreateReview(tourId);

  const currentUserId = user?._id ?? user?.id;

  // Guest: show a clear sign-in CTA instead of an unusable form.
  if (!user || !currentUserId) {
    return <SignInPrompt tourSlug={tourSlug} />;
  }


const userReview = reviews.find((review) => {
  const reviewUserId =
    typeof review.user === "string"
      ? review.user
      : review.user?._id;

  return reviewUserId === currentUserId;
});

// Review الخاصة بالمستخدم أصبحت معروضة داخل Reviews grid
// في ViewDetails مع Badge "You" وEdit icon.
// لذلك لا نعرض form ولا بطاقة إضافية هنا.
if (userReview) {
  return null;
}
  const onSubmit = (data: ReviewFormData) => {
    if (isPending) {
      return;
    }

    mutate(
      {
        review: data.review,
        rating: data.rating as Rating,
      },
      {
        onSuccess: () => {
          reset({ rating: 5, review: "" });
        },
      },
    );
  };

  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message ??
      error.response?.data?.errors?.[0]?.message ??
      "Could not submit your review. Please try again."
    : "Could not submit your review. Please try again.";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Write a review
      </h3>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Rating
        </label>

        <input type="hidden" {...register("rating", { valueAsNumber: true })} />

        <StarPicker
          value={rating}
          onChange={(value) =>
            setValue("rating", value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        />

        {errors.rating && (
          <p
            role="alert"
            className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="review-text"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Your review
        </label>

        <textarea
          id="review-text"
          {...register("review")}
          placeholder="Share your experience..."
          aria-invalid={Boolean(errors.review)}
          maxLength={500}
          rows={4}
          className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />

        {errors.review && (
          <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
            {errors.review.message}
          </p>
        )}

        <p className="mt-1 text-right text-xs text-slate-400">
          {reviewText.length} / 500
        </p>
      </div>

      {isError && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}