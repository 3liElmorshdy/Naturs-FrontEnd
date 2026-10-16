import React from "react";
import { AlertCircle } from "lucide-react";

interface WishlistErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export function WishlistErrorBanner({
  error,
  onRetry,
}: WishlistErrorBannerProps) {
  return (
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
        onClick={onRetry}
        className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 transition hover:bg-rose-200 active:scale-95 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
      >
        Try Again
      </button>
    </div>
  );
}

export default WishlistErrorBanner;
