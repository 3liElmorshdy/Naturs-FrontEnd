import { ReceiptText, X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { Avatar } from "../../../../components/Avatar/Avatar";
import type { Booking } from "../../../../services/bookingApi";
import {
  extractCustomer,
  formatCurrency,
  formatDate,
  getTourImageUrl,
} from "../utils";

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export function BookingDetailsModal({
  booking,
  onClose,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const customer = extractCustomer(booking.user);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Booking Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Tour Preview */}
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <img
              src={getTourImageUrl(booking.tour?.imageCover)}
              alt={booking.tour?.name || "Tour"}
              className="h-14 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Tour Adventure
              </p>
              <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                {booking.tour?.name || "Unlisted Tour"}
              </p>
              {booking.tour?.slug && (
                <Link
                  to={`/tours/${booking.tour.slug}`}
                  className="mt-0.5 inline-block text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                >
                  View tour public page →
                </Link>
              )}
            </div>
          </div>

          {/* Customer Details (Reusing Avatar) */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Information
            </p>
            {customer ? (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <Avatar
                  photo={customer.photo}
                  name={customer.name || "Customer"}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {customer.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {customer.email || "No email"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                User ID: {String(booking.user || "Not provided")}
              </p>
            )}
          </div>

          {/* Financial & Status Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
              <span className="text-xs text-slate-400">Total Price</span>
              <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(booking.price)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
              <span className="text-xs text-slate-400">Payment Status</span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    booking.paid
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  }`}
                >
                  {booking.paid ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
              <span className="text-xs text-slate-400">Created Date</span>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(booking.createdAt)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
              <span className="text-xs text-slate-400">Booking ID</span>
              <p
                className="mt-1 truncate font-mono text-xs text-slate-600 dark:text-slate-400"
                title={booking._id}
              >
                {booking._id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
