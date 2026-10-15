import { RefreshCw, Trash2 } from "lucide-react";
import React from "react";

import type { Booking } from "../../../../services/bookingApi";

interface DeleteBookingModalProps {
  booking: Booking | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteBookingModal({
  booking,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteBookingModalProps) {
  if (!booking) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Delete Booking Reservation?
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to remove booking{" "}
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            #{booking._id.slice(0, 8)}
          </span>{" "}
          for{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {booking.tour?.name || "this tour"}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
          >
            {isDeleting && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
