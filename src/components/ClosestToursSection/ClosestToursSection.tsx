import { useUserLocation } from "../../hooks/useUserLocation";
import { useTourDistances } from "../../hooks/Tour/useTourDistances";
import { ClosestTours } from "../ClosestTours/ClosestTours";

export function ClosestToursSection() {
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    requestLocation,
  } = useUserLocation();

  const {
    data: toursWithDistance = [],
    isLoading: isDistancesLoading,
    isError: isDistancesError,
  } = useTourDistances({
    ...(location && {
      latitude: location.latitude,
      longitude: location.longitude,
    }),
    unit: "mi",
    enabled: Boolean(location),
  });

  const isLoading = isLocationLoading || isDistancesLoading;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {!location ? (
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 text-center dark:border-teal-900/50 dark:bg-teal-950/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-800 dark:text-white">
            Find tours near you
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Share your location to see trips ordered by distance from you.
          </p>

          <button
            type="button"
            onClick={requestLocation}
            disabled={isLocationLoading}
            className="mt-4 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLocationLoading ? "Finding your location..." : "Use my location"}
          </button>

          {locationError && (
            <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
              {locationError}
            </p>
          )}
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
          )}

          {isDistancesError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              We could not load nearby tours. Please try again.
            </div>
          )}

          {!isLoading && !isDistancesError && (
            <ClosestTours tours={toursWithDistance} unit="mi" />
          )}
        </>
      )}
    </section>
  );
}