import type Tour from "../../types/Tour";
import { TOUR_IMG, diffStyle } from "../../utils/viewDetails";

interface TourHeroProps {
  tour: Tour;
  tourId: string;
}

export function TourHero({
  tour,
  tourId,
}: TourHeroProps) {
  return (
    <header className="relative h-72 sm:h-96">
      <img
        src={`${TOUR_IMG}${tour.imageCover}`}
        alt={tour.name}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src =
            `https://picsum.photos/seed/${tourId}/1600/700`;
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-4 pb-8">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            diffStyle[tour.difficulty]
          }`}
        >
          {tour.difficulty}
        </span>

        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          {tour.name}
        </h1>

        <p className="mt-1 text-sm text-white/80">
          ★ {tour.ratingsAverage.toFixed(1)} · {tour.ratingsQuantity}{" "}
          review{tour.ratingsQuantity === 1 ? "" : "s"}
          {tour.startLocation?.description &&
            ` · ${tour.startLocation.description}`}
        </p>
      </div>
    </header>
  );
}