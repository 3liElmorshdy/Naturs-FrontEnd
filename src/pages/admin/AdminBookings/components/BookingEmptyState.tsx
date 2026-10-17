import { ReceiptText } from "lucide-react";
import React from "react";

interface BookingEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function BookingEmptyState({
  isFiltered,
  onClearFilters,
}: BookingEmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
        <ReceiptText className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        {isFiltered ? "No matching bookings found" : "No customer bookings yet"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {isFiltered
          ? "Try clearing or tweaking your search terms and filters."
          : "When customers book tours on Tejwal, they will automatically appear here."}
      </p>
      {isFiltered && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
