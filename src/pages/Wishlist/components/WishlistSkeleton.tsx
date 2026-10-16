import React from "react";

interface WishlistSkeletonProps {
  count?: number;
}

export function WishlistSkeleton({ count = 6 }: WishlistSkeletonProps) {
  return (
    <div
      aria-label="Loading wishlist items"
      className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
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

export default WishlistSkeleton;
