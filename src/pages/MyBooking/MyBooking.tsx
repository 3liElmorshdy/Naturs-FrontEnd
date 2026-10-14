import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  DollarSign,
  MapPin,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_ORIGIN } from "../../config";
import {
  getBookingErrorMessage,
  getMyBookings,
  type Booking,
} from "../../services/bookingApi";

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────────── */
function getTourImageUrl(imageCover?: string): string {
  if (!imageCover) {
    return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80";
  }
  if (imageCover.startsWith("http://") || imageCover.startsWith("https://")) {
    return imageCover;
  }
  if (imageCover.startsWith("/")) {
    return `${API_ORIGIN}${imageCover}`;
  }
  return `${API_ORIGIN}/img/tours/${imageCover}`;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Date to be confirmed";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

type BookingStatus = {
  label: "Upcoming" | "Completed" | "Pending Payment";
  badgeClass: string;
  dotClass: string;
};

function getBookingStatus(
  startDate?: string,
  isPaid?: boolean,
): BookingStatus {
  if (isPaid === false) {
    return {
      label: "Pending Payment",
      badgeClass:
        "bg-amber-500/90 text-white shadow-sm backdrop-blur-md dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/30",
      dotClass: "bg-amber-300",
    };
  }

  if (startDate) {
    const tourDate = new Date(startDate);
    const now = new Date();
    if (!Number.isNaN(tourDate.getTime()) && tourDate < now) {
      return {
        label: "Completed",
        badgeClass:
          "bg-slate-800/85 text-slate-100 shadow-sm backdrop-blur-md dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700",
        dotClass: "bg-slate-400",
      };
    }
  }

  return {
    label: "Upcoming",
    badgeClass:
      "bg-emerald-600/90 text-white shadow-sm backdrop-blur-md dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/30",
    dotClass: "bg-emerald-300",
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: BookingCard
   Individual tour card with responsive aspect-video image, key metrics,
   prominent typography, status pill, and action CTA
   ───────────────────────────────────────────────────────────────────────────── */
interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const tour = booking.tour;
  const tourStartDate =
    booking.startDate || tour?.startDates?.[0] || booking.createdAt;

  const [imageSrc, setImageSrc] = useState(() =>
    getTourImageUrl(tour?.imageCover),
  );

  const status = getBookingStatus(tourStartDate, booking.paid);
  const tourName = tour?.name || "Unlisted Tour Adventure";
  const guestsCount = tour?.maxGroupSize || 1;
  const tourDuration = tour?.duration ? `${tour.duration} days` : null;
  const tourUrl = tour?.slug ? `/tours/${tour.slug}` : `/tours/${tour?._id || ""}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500/30 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* ── Image Cover (aspect-video) ── */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imageSrc}
          alt={tourName}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          onError={() =>
            setImageSrc(
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
            )
          }
          loading="lazy"
        />

        {/* Subtle Vignette Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute right-3.5 top-3.5 flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${status.badgeClass}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
              aria-hidden="true"
            />
            {status.label}
          </span>
        </div>

        {/* Duration / Location overlay (bottom of image) */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-medium text-white/95 drop-shadow">
          {tour?.startLocation?.description ? (
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-300" />
              <span className="truncate">{tour.startLocation.description}</span>
            </span>
          ) : (
            <span />
          )}

          {tourDuration && (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-slate-100 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-teal-300" />
              {tourDuration}
            </span>
          )}
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Tour Title */}
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
            {tourName}
          </h3>

          {/* Key Details Grid (Icons: Date, Price, Guests) */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            {/* Start Date */}
            <div className="flex flex-col">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                Date
              </span>
              <span className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(tourStartDate)}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col border-x border-slate-200/60 px-2 dark:border-slate-700/60">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <DollarSign className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                Price
              </span>
              <span className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatPrice(booking.price)}
              </span>
            </div>

            {/* Guests Count */}
            <div className="flex flex-col pl-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                Guests
              </span>
              <span className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                {guestsCount} {guestsCount === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Action Button ── */}
        <div className="mt-5 pt-3">
          <Link
            to={tourUrl}
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <span>View Tour</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: EmptyBookingsState
   Designed with centered friendly illustration, warm copy, and a primary CTA
   ───────────────────────────────────────────────────────────────────────────── */
export function EmptyBookingsState() {
  return (
    <section
      aria-label="Empty bookings state"
      className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-white/70 px-6 py-16 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50"
    >
      {/* Friendly Centered Illustration / Icon */}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 shadow-inner ring-8 ring-teal-50/70 transition-transform duration-500 hover:scale-105 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/10">
        <Compass className="h-12 w-12 stroke-[1.75] transition-transform duration-700 hover:rotate-45" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </span>
      </div>

      {/* Heading */}
      <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        No adventures yet!
      </h2>

      {/* Supportive Copy */}
      <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400">
        You haven&apos;t booked any tours. Time to pack your bags and start
        exploring.
      </p>

      {/* Primary CTA Button */}
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 rounded-2xl bg-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Tours</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: BookingsSkeleton
   Clean loading state with matching 1-to-3 column aspect-video cards
   ───────────────────────────────────────────────────────────────────────────── */
function BookingsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="aspect-video w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-16 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE: MyBookings
   ───────────────────────────────────────────────────────────────────────────── */
export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const liveBookings = await getMyBookings();
      setBookings(liveBookings);
    } catch (error) {
      setErrorMessage(getBookingErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ── */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              <Compass className="h-4 w-4" />
              <span>Travel Dashboard</span>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Manage and explore your booked adventures across the globe.
            </p>
          </div>

          {/* Right Header Stats & Refresh Action */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => void fetchBookings()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Refresh bookings"
            >
              <RefreshCw
                className={`h-4 w-4 text-teal-600 dark:text-teal-400 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            {/* Total Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-slate-500 dark:text-slate-400">Total:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {bookings.length} {bookings.length === 1 ? "tour" : "tours"}
              </span>
            </div>
          </div>
        </header>

        {/* ── Error Banner ── */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-8 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Failed to load bookings</p>
                <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void fetchBookings()}
              className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Content Area: Loading / Empty / Grid ── */}
        {isLoading ? (
          <BookingsSkeleton />
        ) : bookings.length === 0 ? (
          <EmptyBookingsState />
        ) : (
          <section
            aria-label="Booked tours list"
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyBookings;