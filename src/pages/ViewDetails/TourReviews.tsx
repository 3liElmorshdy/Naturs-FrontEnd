import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import type { Review } from "../../services/reviews";
import { Avatar } from "../../components/Avatar/Avatar";
import { Stars } from "../../components/Stars/Stars";
import { ReviewForm } from "../../components/ReviewForm/ReviewForm";

interface TourReviewsProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  currentUserId?: string | undefined;
  tourId: string;
  tourSlug: string;
  onEditReview?: (reviewId: string) => void;
}

const INITIAL_REVIEWS_COUNT = 4;
const REVIEWS_INCREMENT_STEP = 4;

function formatReviewDate(dateString?: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function ReviewsSkeletonGrid() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Loading reviews..."
      role="status"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
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
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_REVIEWS_COUNT);

  // UX Principle: Surfacing current user's review at position #1
  // Validates their submission immediately and offers quick access to edit actions.
  const sortedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    if (!currentUserId) return reviews;

    return [...reviews].sort((a, b) => {
      const aUserId = typeof a.user === "string" ? a.user : a.user?._id;
      const bUserId = typeof b.user === "string" ? b.user : b.user?._id;
      const aIsCurrent = Boolean(aUserId && aUserId === currentUserId);
      const bIsCurrent = Boolean(bUserId && bUserId === currentUserId);

      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
      return 0;
    });
  }, [reviews, currentUserId]);

  const totalCount = sortedReviews.length;
  const displayedReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < totalCount;
  const remainingCount = Math.max(0, totalCount - visibleCount);
  const nextBatchCount = Math.min(REVIEWS_INCREMENT_STEP, remainingCount);
  const isExpanded = visibleCount > INITIAL_REVIEWS_COUNT;

  // Average rating calculated from current reviews
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const progressPercent =
    totalCount > 0
      ? Math.min(100, Math.round((displayedReviews.length / totalCount) * 100))
      : 0;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + REVIEWS_INCREMENT_STEP, totalCount));
  };

  const handleShowAll = () => {
    setVisibleCount(totalCount);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_REVIEWS_COUNT);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="scroll-mt-24 space-y-6"
    >
      {/* Header section with UX statistics and progress bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2
              id="reviews-heading"
              className="text-xl font-bold tracking-tight text-slate-800 dark:text-white"
            >
              Reviews
            </h2>

            <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-900/30 dark:text-teal-300">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {averageRating && reviews.length > 0 && (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Stars value={Number(averageRating)} />
              <span className="font-semibold text-slate-800 dark:text-white">
                {averageRating}
              </span>
              <span className="text-slate-400 dark:text-slate-500">out of 5</span>
            </div>
          )}
        </div>

        {/* Informative Status Indicator (UX Visibility of System Status) */}
        {!isLoading && !isError && totalCount > INITIAL_REVIEWS_COUNT && (
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>
                Showing <strong className="text-slate-800 dark:text-slate-200">{displayedReviews.length}</strong> of{" "}
                <strong className="text-slate-800 dark:text-slate-200">{totalCount}</strong> reviews
              </span>
            </div>
            <div
              className="h-1.5 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/60"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reviews displayed progress"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && <ReviewsSkeletonGrid />}

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
            Could not load reviews. Please refresh or try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-white">
            No reviews yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Be the first traveler to share your experience on this tour!
          </p>
        </div>
      )}

      {/* Reviews Grid */}
      {!isLoading && !isError && totalCount > 0 && (
        <>
          <ul
            id="reviews-list"
            className="grid gap-4 sm:grid-cols-2"
            aria-label="Tour traveler reviews"
          >
            {displayedReviews.map((review) => {
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

              const formattedDate = formatReviewDate(review.createdAt);

              return (
                <li
                  key={review._id}
                  className={[
                    "relative flex flex-col justify-between rounded-2xl bg-white p-5 ring-1 transition-all duration-200 hover:shadow-md dark:bg-slate-800",
                    isCurrentUserReview
                      ? "ring-2 ring-teal-500/70 shadow-sm shadow-teal-500/10 dark:ring-teal-400/80"
                      : "ring-slate-200 hover:ring-slate-300 dark:ring-slate-700 dark:hover:ring-slate-600",
                  ].join(" ")}
                >
                  {/* Top: User info & rating */}
                  <div>
                    {isCurrentUserReview && (
                      <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
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

                    <div className="mb-3 flex items-center gap-3 pr-16">
                      <Avatar
                        name={reviewUser?.name ?? "Traveler"}
                        {...(reviewUser?.photo ? { photo: reviewUser.photo } : {})}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                          {reviewUser?.name ?? "Traveler"}
                        </p>

                        <div className="flex items-center gap-2">
                          <Stars value={review.rating} />
                          {formattedDate && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              · {formattedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {review.review}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Progressive Disclosure Action Area */}
          {totalCount > INITIAL_REVIEWS_COUNT && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2.5 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={handleShowMore}
                    aria-expanded={false}
                    aria-controls="reviews-list"
                    className="group inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98]"
                  >
                    <span>Show more reviews</span>
                    <span className="flex h-5 items-center rounded-md bg-teal-700/70 px-1.5 text-xs font-medium text-teal-100">
                      +{nextBatchCount}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleShowLess}
                    aria-expanded={true}
                    aria-controls="reviews-list"
                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
                  >
                    <span>Show less</span>
                    <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  </button>
                )}

                {/* Quick Shortcut: Show all when user has >4 remaining */}
                {hasMore && remainingCount > nextBatchCount && (
                  <button
                    type="button"
                    onClick={handleShowAll}
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-teal-600 transition hover:bg-teal-50 hover:text-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Show all ({totalCount})
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                {hasMore
                  ? `${remainingCount} more ${remainingCount === 1 ? "review" : "reviews"} remaining`
                  : "All reviews are currently displayed"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Review Submission / Call to Action */}
      <ReviewForm
        tourId={tourId}
        tourSlug={tourSlug}
        reviews={reviews}
      />
    </section>
  );
}