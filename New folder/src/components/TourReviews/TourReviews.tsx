import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "../../schemas/reviewSchema";
import type Review from "../../types/Review";
import type { Rating } from "../../types/Review";
import { useEditReview } from "../../hooks/Review/useEditReview";

interface EditReviewModalProps {
  review: Review;
  tourId: string;
  onClose: () => void;
}
    
export function EditReviewModal({
  review,
  tourId,
  onClose,
}: EditReviewModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: review.rating, review: review.review },
  });

  const rating = watch("rating");

  const { mutate, isPending } = useEditReview();

  function onSubmit(data: ReviewFormData) {
    mutate(
      {
        reviewId: review._id,
        rating: data.rating as Rating,
        review: data.review,
        tourId,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Edit your review
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            ×
          </button>
        </div>

        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Rating
        </label>

        <div className="mt-2 flex gap-1" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("rating", value, { shouldValidate: true })
              }
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              className={[
                "text-3xl transition",
                value <= rating
                  ? "text-amber-400"
                  : "text-slate-300 dark:text-slate-600",
              ].join(" ")}
            >
              ★
            </button>
          ))}
        </div>

        <label
          htmlFor="edit-review-text"
          className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Review
        </label>

        <textarea
          id="edit-review-text"
          {...register("review")}
          aria-invalid={Boolean(errors.review)}
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />

        {errors.review && (
          <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
            {errors.review.message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}