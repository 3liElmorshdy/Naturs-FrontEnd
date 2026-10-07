import { Avatar } from "../../components/Avatar/Avatar";
import type Tour from "../../types/Tour";
import type User from "../../types/User";
import { formatMonth } from "../../utils/viewDetails";

interface TourBookingCardProps {
  tour: Tour;
  upcomingDates: (string | Date)[];
  guides: User[];
}

export function TourBookingCard({
  tour,
  upcomingDates,
  guides,
}: TourBookingCardProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">
            ${tour.price.toLocaleString("en-US")}
            <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              / person
            </span>
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Upcoming dates
          </p>

          {upcomingDates.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
              {upcomingDates.slice(0, 3).map((date) => (
                <li key={String(date)}>{formatMonth(date)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New dates will be announced soon.
            </p>
          )}
        </div>

        {guides.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Your guides
            </p>

            <ul className="space-y-3">
              {guides.map((guide) => (
                <li key={guide._id} className="flex items-center gap-3">
                  <Avatar name={guide.name} {...(guide.photo !== undefined && { photo: guide.photo })} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                      {guide.name}
                    </p>

                    {guide.role && (
                      <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                        {guide.role.replace("-", " ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
        >
          {upcomingDates.length > 0
            ? "Book this tour"
            : "Check availability"}
        </button>
      </div>
    </aside>
  );
}