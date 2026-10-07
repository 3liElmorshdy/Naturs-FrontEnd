import { TourCard } from "../TourCard/TourCard";
import type { TourWithDistance } from "../../hooks/Tour/useTourDistances";
import type { DistanceUnit } from "../../utils/formatDistance";

interface ClosestToursProps {
  tours: TourWithDistance[];
  unit: DistanceUnit;
  currentTourId?: string;
  limit?: number;
}

export function ClosestTours({
  tours,
  unit,
  currentTourId,
  limit = 3,
}: ClosestToursProps) {
  // الـ endpoint مرتب بالفعل بالأقرب أولًا.
  // نستبعد current tour فقط لو القسم موجود في صفحة Tour Details.
  const closestTours = tours
    .filter((tour) => (tour._id ?? tour.id) !== currentTourId)
    .slice(0, limit);

  if (closestTours.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="closest-tours-heading">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          Based on your location
        </p>

        <h2
          id="closest-tours-heading"
          className="mt-1 text-2xl font-bold text-slate-800 dark:text-white"
        >
          Closest tours to you
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Explore unforgettable adventures ordered by distance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {closestTours.map((tour) => (
          <TourCard
            key={tour._id ?? tour.id}
            tour={tour}
            distance={tour.distance}
            distanceUnit={unit}
          />
        ))}
      </div>
    </section>
  );
}