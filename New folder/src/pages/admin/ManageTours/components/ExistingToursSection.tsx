import { Trash2 } from "lucide-react";

import type Tour from "../../../../types/Tour";

type ExistingToursSectionProps = {
  tours: Tour[];
  isLoadingTours: boolean;
  onDeleteClick: (tour: Tour) => void;
};

function ExistingToursSection({
  tours,
  isLoadingTours,
  onDeleteClick,
}: ExistingToursSectionProps) {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Existing Tours
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Delete tours from the Natours catalog.
          </p>
        </div>

        <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
          {tours.length} tours
        </span>
      </div>

      {isLoadingTours ? (
        <div className="mt-6 flex h-40 items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400" />
          Loading tours...
        </div>
      ) : tours.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No tours found.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tours.map((tour) => (
            <article
              key={tour._id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-500/50"
            >
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                  {tour.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {tour.duration} days · ${tour.price}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                  {tour.difficulty}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteClick(tour)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                aria-label={`Delete ${tour.name}`}
                title={`Delete ${tour.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExistingToursSection;
