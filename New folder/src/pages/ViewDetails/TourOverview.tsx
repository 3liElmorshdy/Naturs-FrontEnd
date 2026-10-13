import type Tour from "../../types/Tour";
import { formatMonth } from "../../utils/viewDetails";

function Fact({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="text-base font-semibold capitalize text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

interface TourOverviewProps {
  tour: Tour;
  upcomingDates: (string | Date)[];
}

export function TourOverview({
  tour,
  upcomingDates,
}: TourOverviewProps) {
  return (
    <section
      aria-label="Tour overview"
      className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 sm:grid-cols-4"
    >
      <Fact label="Duration" value={`${tour.duration} days`} />
      <Fact label="Group size" value={`Up to ${tour.maxGroupSize}`} />
      <Fact label="Difficulty" value={tour.difficulty} />
      <Fact
        label="Next start"
        value={upcomingDates[0] ? formatMonth(upcomingDates[0]) : "TBA"}
      />
    </section>
  );
}