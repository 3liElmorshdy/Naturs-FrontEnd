import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import api from "../../services/api";

import type { RootState } from "../../store/store";
import type User from "../../types/User";
import type Tour from "../../types/Tour";

import { useTourFilters } from "../../hooks/Tour/useFilteredTours";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useTourDistances } from "../../hooks/Tour/useTourDistances";

import { HeroBanner } from "../../components/HeroBanner/HeroBanner";
import { TourFilters } from "../../components/TourFilters/TourFilters";
import { TourCard } from "../../components/TourCard/TourCard";
import { TourSkeleton } from "../../components/TourSkeleton/TourSkeleton";

function Home() {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;

  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data: allTours,
    isLoading: isToursLoading,
    isError: isToursError,
  } = useQuery({
    queryKey: ["tours"],

    queryFn: async () => {
      const response = await api.get("/tours");

      return response.data?.data?.data as Tour[];
    },

    staleTime: 5 * 60 * 1000,
  });

  const {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    isFiltered,
    clearFilters,
    filteredTours,
  } = useTourFilters(allTours);

  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    requestLocation,
    clearLocation,
  } = useUserLocation();

  const {
    data: toursWithDistance = [],
    isLoading: isNearbyLoading,
    isError: isNearbyError,
  } = useTourDistances({
    ...(location && {
      latitude: location.latitude,
      longitude: location.longitude,
    }),

    unit: "mi",
    enabled: Boolean(location),
  });

  /*
    عندما Near Me غير مفعّل:
    - نعرض كل tours بعد search/filters/sort.

    عندما Near Me مفعّل:
    - نعرض فقط tours التي رجعها geospatial endpoint.
    - نطبق عليها search/filters الموجودة حاليًا
      عن طريق مطابقة IDs مع filteredTours.
  */
  const displayedTours = useMemo(() => {
    if (!location) {
      return filteredTours;
    }

    const allowedIds = new Set(filteredTours.map((tour) => tour._id));

    return toursWithDistance.filter((tour) => allowedIds.has(tour._id));
  }, [location, filteredTours, toursWithDistance]);

  const isLoading =
    isToursLoading ||
    isLocationLoading ||
    (Boolean(location) && isNearbyLoading);

  const isError = isToursError || (Boolean(location) && isNearbyError);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleClearAll() {
    clearFilters();
    clearLocation();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HeroBanner
        user={user}
        filteredToursCount={displayedTours.length}
        onExploreClick={scrollToSearch}
      />

      <div ref={searchRef}>
        <TourFilters
          search={search}
          setSearch={setSearch}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultsCount={displayedTours.length}
          isFiltered={isFiltered}
          onClearFilters={handleClearAll}
          isLocating={isLocationLoading}
          isNearMeActive={Boolean(location)}
          locationError={locationError}
          onNearMe={requestLocation}
          onClearNearMe={clearLocation}
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <TourSkeleton key={index} />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">
              ⚠️
            </div>

            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Could not load tours
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {location
                ? "We could not load tours near your location. Please try again."
                : "Make sure the backend server is running and try again."}
            </p>

            {location && (
              <button
                type="button"
                onClick={clearLocation}
                className="mt-4 text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
              >
                Show all tours
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && displayedTours.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">
              {location ? "📍" : "🔍"}
            </div>

            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {location
                ? "No tours found near your location"
                : "No tours match your filters"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {location
                ? "Try showing all tours or changing your filters."
                : "Try changing or clearing your filters."}
            </p>

            <button
              type="button"
              onClick={location ? clearLocation : clearFilters}
              className="mt-4 text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
            >
              {location ? "Show all tours" : "Clear all filters"}
            </button>
          </div>
        )}

        {!isLoading && !isError && displayedTours.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} distanceUnit="mi" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
