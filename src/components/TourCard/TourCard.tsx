import { useState } from "react";
import { Link } from "react-router-dom";
import type Tour from "../../types/Tour";
import { formatDistance } from "../../utils/formatDistance";
import type { DistanceUnit } from "../../utils/formatDistance";
const API_URL = "http://localhost:5020";
const TOURS_IMAGE_BASE = `${API_URL}/img/tours/`;
interface TourCardProps {
  tour: Tour;
  distanceUnit?: DistanceUnit;
}

const getTourImageUrl = (imageCover?: string) => {
  if (!imageCover) {
    return "https://picsum.photos/seed/default-tour/600/400";
  }

  // لو الـ backend رجّع URL كامل
  if (
    imageCover.startsWith("http://") ||
    imageCover.startsWith("https://")
  ) {
    return imageCover;
  }

  // لو الـ backend رجّع /img/tours/tour-1-cover.jpg
  if (imageCover.startsWith("/")) {
    return `${API_URL}${imageCover}`;
  }

  // لو الـ backend رجّع tour-1-cover.jpg
  return `${TOURS_IMAGE_BASE}${imageCover}`;
};
export function TourCard({
  tour,
  distanceUnit = "mi",
}: TourCardProps) 


{ const [imageSrc, setImageSrc] = useState(() =>
    getTourImageUrl(tour.imageCover),
  );

  const diffColor = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    difficult:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  }[tour.difficulty];

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const fallbackImage = `https://picsum.photos/seed/${tour._id}/600/400`;

    // يمنع محاولة تحميل fallback بلا نهاية لو فشلت هي كمان.
    if (event.currentTarget.src !== fallbackImage) {
      setImageSrc(fallbackImage);
    }
  };

  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-teal-400/50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-teal-500/40">
      {/* Cover image */}
      <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img
          src={imageSrc}
          alt={tour.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImageError}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm ${diffColor}`}
        >
          {tour.difficulty}
        </span>

        <div className="absolute right-3 top-3 rounded-full bg-teal-600 px-3 py-1 text-sm font-bold text-white shadow">
          ${tour.price}
        </div>

        <div className="absolute bottom-3 left-4 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          <span className="text-xs font-semibold text-white">
            {Number(tour.ratingsAverage ?? 0).toFixed(1)}
          </span>

          <span className="text-xs text-white/70">
            ({tour.ratingsQuantity ?? 0})
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="mb-1.5 line-clamp-2 text-lg font-extrabold leading-snug text-slate-800 dark:text-white">
            {tour.name}
          </h3>

          {tour.startLocation?.description && (
            <p className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {tour.startLocation.description}
            </p>
          )}




{tour.distance !== undefined && (
  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
    <svg
      className="h-3.5 w-3.5 shrink-0"
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

    <span>
      {formatDistance(tour.distance, distanceUnit)}
    </span>
  </p>
)}


        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {tour.summary}
        </p>

        <div className="flex items-center gap-4 border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <svg
              className="h-4 w-4 text-teal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {tour.duration}
              </span>{" "}
              days
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <svg
              className="h-4 w-4 text-teal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {tour.maxGroupSize}
              </span>{" "}
              people
            </span>
          </div>
        </div>

        <Link
          to={`/tours/${tour.slug}`}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-teal-700 hover:shadow-md active:scale-95"
        >
         View Details
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}