import React from "react";
import { Heart, RefreshCw } from "lucide-react";

interface WishlistHeaderProps {
  itemCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export function WishlistHeader({
  itemCount,
  isLoading,
  onRefresh,
}: WishlistHeaderProps) {
  return (
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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh wishlist items"
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
            {itemCount} {itemCount === 1 ? "tour" : "tours"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default WishlistHeader;
