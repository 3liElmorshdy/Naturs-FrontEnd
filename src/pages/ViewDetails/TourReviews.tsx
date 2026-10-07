import type { Review } from "../../services/reviews";
import { Avatar } from "../../components/Avatar/Avatar";
import { Stars } from "../../components/Stars/Stars";
import { ReviewForm } from "../../components/ReviewForm/ReviewForm";

interface TourReviewsProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  currentUserId?: string;
  tourId: string;
  tourSlug: string;
  onEditReview?: (reviewId: string) => void;
}

export function TourReviews({
  reviews,
  isLoading,
  isError,
  currentUserId,
  tourId,
  tourSlug,
  onEditReview,
}: TourReviewsProps) {
  return (
    <section aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="mb-4 text-xl font-bold text-slate-800 dark:text-white"
      >
        Reviews ({reviews.length})
      </h2>

      {isLoading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading reviews...
        </p>
      )}

      {isError && (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          Could not load reviews. Please try again.
        </p>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No reviews yet.
        </p>
      )}

      {!isLoading && !isError && reviews.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => {
            const reviewUser =
              review.user && typeof review.user !== "string"
                ? review.user
                : null;

            const reviewUserId =
              typeof review.user === "string"
                ? review.user
                : review.user?._id;

            const isCurrentUserReview =
              Boolean(currentUserId) &&
              Boolean(reviewUserId) &&
              reviewUserId === currentUserId;

            return (
              <li
                key={review._id}
                className={[
                  "relative rounded-2xl bg-white p-4 ring-1 transition dark:bg-slate-800",
                  isCurrentUserReview
                    ? "ring-teal-500/60"
                    : "ring-slate-200 dark:ring-slate-700",
                ].join(" ")}
              >
{isCurrentUserReview && (
  <div className="absolute right-3 top-3 flex items-center gap-1.5">
    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
      You
    </span>

    {onEditReview && (
      <button
        type="button"
        aria-label="Edit your review"
        title="Edit your review"
        onClick={() => onEditReview(review._id)}
        className="rounded-md p-1.5 text-teal-700 transition hover:bg-teal-100 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-300 dark:hover:bg-teal-500/15 dark:hover:text-teal-100"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 3.487 3.651 3.651M4 20h4l10.5-10.5a2.586 2.586 0 0 0-3.66-3.66L4.34 16.34A2.586 2.586 0 0 0 4 20Z"
          />
        </svg>
      </button>
    )}
  </div>
)}
                <div className="mb-2 flex items-center gap-3 pr-16">
                  <Avatar
                    name={reviewUser?.name ?? "Traveler"}
                    {...(reviewUser?.photo ? { photo: reviewUser.photo } : {})}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                      {reviewUser?.name ?? "Traveler"}
                    </p>

                    <Stars value={review.rating} />
                  </div>
                </div>

                <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {review.review}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <ReviewForm
        tourId={tourId}
        tourSlug={tourSlug}
        reviews={reviews}
      />
    </section>
  );
}