import {
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";
import React from "react";

import { Avatar } from "../../../../components/Avatar/Avatar";
import type { Booking } from "../../../../services/bookingApi";
import {
  extractCustomer,
  formatCurrency,
  formatDate,
  getTourImageUrl,
} from "../utils";

interface BookingGridProps {
  bookings: Booking[];
  isUpdatingId: string | null;
  onTogglePaid: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
  onDeleteClick: (booking: Booking) => void;
}

export function BookingGrid({
  bookings,
  isUpdatingId,
  onTogglePaid,
  onViewDetails,
  onDeleteClick,
}: BookingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => {
        const customer = extractCustomer(booking.user);
        const tourName = booking.tour?.name || "Unlisted Tour";
        const isUpdating = isUpdatingId === booking._id;

        return (
          <div
            key={booking._id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              {/* Top image & badges */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={getTourImageUrl(booking.tour?.imageCover)}
                  alt={tourName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                <button
                  type="button"
                  onClick={() => onTogglePaid(booking)}
                  disabled={isUpdating}
                  className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md transition ${
                    booking.paid
                      ? "bg-emerald-600/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {isUpdating ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : booking.paid ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  <span>{booking.paid ? "Paid" : "Pending"}</span>
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  <p className="truncate text-base font-bold text-white drop-shadow">
                    {tourName}
                  </p>
                </div>
              </div>

              {/* Customer & Info body (Reusing Avatar) */}
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar
                    photo={customer?.photo}
                    name={customer?.name || "Customer"}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {customer?.name || "Anonymous User"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {customer?.email || "No email available"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Amount
                    </span>
                    <p className="mt-0.5 font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(booking.price)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Booked On
                    </span>
                    <p className="mt-0.5 font-bold text-slate-700 dark:text-slate-300">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onViewDetails(booking)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Details</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteClick(booking)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 dark:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
