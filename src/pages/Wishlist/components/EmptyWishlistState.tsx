import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Heart, Sparkles } from "lucide-react";

interface EmptyWishlistStateProps {
  explorePath?: string;
  onExploreClick?: () => void;
}

export function EmptyWishlistState({
  explorePath = "/",
  onExploreClick,
}: EmptyWishlistStateProps) {
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
          to={explorePath}
          onClick={onExploreClick}
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

export default EmptyWishlistState;
