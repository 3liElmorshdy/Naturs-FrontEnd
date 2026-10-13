import type Tour from "../../types/Tour";
import { TourCard } from "../TourCard/TourCard";

interface NearbyToursProps {
  tours: Tour[];
  currentTourId: string;
}

export function NearbyTours({
  tours,
  currentTourId,
}: NearbyToursProps) {
  // لا تعرض الرحلة الحالية مرة ثانية داخل الاقتراحات.
  // اعرض بحد أقصى 3 رحلات.
  const nearbyTours = tours
    .filter((tour) => (tour._id ?? tour.id) !== currentTourId)
    .slice(0, 3);
    
  // لا تعرض section فارغًا.
  if (nearbyTours.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="nearby-tours-heading">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          Discover more
        </p>

        <h2
          id="nearby-tours-heading"
          className="mt-1 text-2xl font-bold text-slate-800 dark:text-white"
        >
          More adventures nearby
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Explore other unforgettable trips in this region.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {nearbyTours.map((nearbyTour) => (
          <TourCard
            key={nearbyTour._id ?? nearbyTour.id}
            tour={nearbyTour}
          />
        ))}
      </div>
    </section>
  );
}