import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  MapPin,
  ReceiptText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getMyBookings,
  type Booking,
} from "../../services/bookingApi";
import type { RootState } from "../../store/store";
import { getRequestErrorMessage } from "../../utils/requestError";

function formatDate(value?: string) {
  if (!value) {
    return "Date will be confirmed";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date will be confirmed";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getTourImage(imageCover?: string) {
  if (!imageCover) {
    return "/img/tours/tour-1-cover.jpg";
  }

  if (imageCover.startsWith("http")) {
    return imageCover;
  }

  return `/img/tours/${imageCover}`;
}

function MyBookings() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    async function loadBookings() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedBookings = await getMyBookings();

        setBookings(loadedBookings);
      } catch (error) {
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadBookings();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-700 to-emerald-700 px-6 py-8 text-white shadow-xl shadow-teal-950/10 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-teal-100">
                <Compass className="h-4 w-4" />
                Travel dashboard
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                My Bookings
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-50 sm:text-base">
                Keep track of your upcoming adventures and completed trips.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <ReceiptText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-teal-100">
                  Total bookings
                </p>

                <p className="text-lg font-extrabold">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <section
            role="alert"
            className="mt-8 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">We could not load your bookings.</p>

              <p className="mt-1 leading-6">{errorMessage}</p>
            </div>
          </section>
        )}

        {isLoading ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </section>
        ) : bookings.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <CalendarDays className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your next adventure is waiting. Browse the available tours and
              reserve the one that fits your travel plans.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
            >
              Explore Tours
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => {
              const tour = booking.tour;

              const tourStartDate =
                booking.startDate || tour.startDates?.[0];

              return (
                <article
                  key={booking._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={getTourImage(tour.imageCover)}
                      alt={tour.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />

                    <span
                      className={[
                        "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                        booking.paid
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-amber-950",
                      ].join(" ")}
                    >
                      {booking.paid ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <CreditCard className="h-3.5 w-3.5" />
                      )}

                      {booking.paid ? "Paid" : "Payment pending"}
                    </span>

                    <div className="absolute bottom-4 left-5 right-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-200">
                        Your adventure
                      </p>

                      <h2 className="mt-1 text-2xl font-extrabold text-white">
                        {tour.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Starts
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                            {formatDate(tourStartDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          <MapPin className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Location
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                            {tour.startLocation?.description ||
                              "Location unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Amount paid
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(booking.price)}
                        </p>
                      </div>

                      <Link
                        to={`/tours/${tour.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20"
                      >
                        View Tour
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyBookings;