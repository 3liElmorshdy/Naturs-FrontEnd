import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  Compass,
  Heart,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { TourCard } from "../../components/TourCard/TourCard";
import { fetchWishlist } from "../../store/wishlistSlice";
import type { AppDispatch, RootState } from "../../store/store";

export function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <div
          key={key}
          className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
        >
          <div className="h-56 w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-100 dark:bg-slate-700/60" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-700/50" />
            <div className="flex items-center gap-4 border-t border-slate-100 pt-3 dark:border-slate-700">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="mt-1 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyWishlistState() {
  return (
    <section
      aria-label="Empty wishlist state"
      className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-white/70 px-6 py-16 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-inner ring-8 ring-rose-50/70 transition-transform duration-500 hover:scale-105 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/10">
        <Heart className="h-12 w-12 stroke-[1.75] transition-transform duration-700 hover:scale-110" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </span>
      </div>

      <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        Your Wishlist is Empty!
      </h2>

      <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400">
        Explore our handpicked tours and click the heart icon on any adventure to save it for later.
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 rounded-2xl bg-teal-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Tours</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.wishlist,
  );

  useEffect(() => {
    void dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRefresh = () => {
    void dispatch(fetchWishlist());
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ── */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              <Heart className="h-4 w-4 fill-rose-500" />
              <span>Saved Adventures</span>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              All the tours and adventures you have saved for your future travels.
            </p>
          </div>

          {/* Right Header Stats & Refresh Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Refresh wishlist"
            >
              <RefreshCw
                className={`h-4 w-4 text-rose-600 dark:text-rose-400 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-slate-500 dark:text-slate-400">Saved:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {items.length} {items.length === 1 ? "tour" : "tours"}
              </span>
            </div>
          </div>
        </header>

        {/* ── Error Banner ── */}
        {error && (
          <div
            role="alert"
            className="mb-8 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Failed to load wishlist</p>
                <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Content Area: Loading / Empty / Grid of TourCards ── */}
        {isLoading ? (
          <WishlistSkeleton />
        ) : items.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <section
            aria-label="Saved tours list"
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
