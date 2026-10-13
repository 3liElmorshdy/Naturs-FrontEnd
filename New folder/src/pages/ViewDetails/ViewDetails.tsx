import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useTour } from "../../hooks/Tour/useTour";
import { useToursWithin } from "../../hooks/Tour/useToursWithin";
import { useTourReviews } from "../../hooks/Review/useTourReviews";

import { NearbyTours } from "../../components/NearbyTours/NearbyTours";
import { useState } from "react";
import type User from "../../types/User";
import type { RootState } from "../../store/store";

import { DetailsSkeleton } from "./DetailsSkeleton";
import { TourHero } from "./TourHero";
import { TourOverview } from "./TourOverview";
import { TourItinerary } from "./TourItinerary";
import { TourReviews } from "./TourReviews";
import { TourBookingCard } from "./TourBookingCard";
import { TourGallery } from "./TourGallery";
import type Review from "../../types/Review";
import { EditReviewModal } from "../../components/TourReviews/TourReviews";
function NearbyToursSkeleton() {
  return (
    <section aria-label="Loading nearby tours">
      <div className="mb-5">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-7 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[420px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    </section>
  );
}

function ViewDetails() {
  const { slug } = useParams<{ slug: string }>();

  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?._id ?? user?.id;
const [editingReview, setEditingReview] = useState<Review | null>(null);
  const {
    data: tour,
    isLoading,
    isError,
  } = useTour(slug);

  const longitude = tour?.startLocation?.coordinates?.[0];
  const latitude = tour?.startLocation?.coordinates?.[1];

  const currentTourId = tour?._id ?? tour?.id;

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useTourReviews(currentTourId);

  const {
    data: toursWithin = [],
    isLoading: isNearbyLoading,
  } = useToursWithin({
    distance: 4000,
    ...(latitude !== undefined && { latitude }),
    ...(longitude !== undefined && { longitude }),
    unit: "mi",
    enabled: Number.isFinite(latitude) && Number.isFinite(longitude),
  });

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (isError || !tour || !currentTourId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center dark:bg-slate-950">
        <div className="mb-4 text-5xl" aria-hidden="true">
          🧭
        </div>

        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          Tour not found
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The tour may have been removed or the link is incorrect.
        </p>

        <Link
          to="/"
          className="mt-5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Back to all tours
        </Link>
      </div>
    );
  }

  const allDates = [...(tour.startDates ?? [])].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const upcomingDates = allDates.filter(
    (date) => new Date(date).getTime() > Date.now(),
  );

  const guides = (tour.guides ?? []).filter(
    (guide): guide is User => typeof guide !== "string",
  );

  const paragraphs = (tour.description ?? tour.summary)
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TourHero tour={tour} tourId={currentTourId} />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-10">
          <TourOverview
            tour={tour}
            upcomingDates={upcomingDates}
          />

          <section aria-labelledby="about-tour-heading">
            <h2
              id="about-tour-heading"
              className="mb-3 text-xl font-bold text-slate-800 dark:text-white"
            >
              About this tour
            </h2>

            <div className="space-y-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <TourItinerary locations={tour.locations} />

          <TourGallery
            tourName={tour.name}
            tourId={currentTourId}
            {...(tour.images && { images: tour.images })}
          />

          <TourReviews
            reviews={reviews}
            isLoading={isReviewsLoading}
            isError={isReviewsError}
            currentUserId={currentUserId}
            tourId={currentTourId}
            tourSlug={tour.slug}
            onEditReview={(reviewId) => {
              setEditingReview(
                reviews.find((review) => review._id === reviewId) ?? null,
              );
            }}
          />

{editingReview && (
  <EditReviewModal
    review={editingReview}
    tourId={currentTourId}
    onClose={() => setEditingReview(null)}
  />
)}
        </main>


        <TourBookingCard
          tour={tour}
          upcomingDates={upcomingDates}
          guides={guides}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12">
        {isNearbyLoading ? (
          <NearbyToursSkeleton />
        ) : (
          <NearbyTours
            tours={toursWithin}
            currentTourId={currentTourId}
          />
        )}
      </div>
    </div>
  );
}

export default ViewDetails;