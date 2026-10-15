import {
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";
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

interface BookingTableProps {
  bookings: Booking[];
  isUpdatingId: string | null;
  onTogglePaid: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
  onDeleteClick: (booking: Booking) => void;
}

export function BookingTable({
  bookings,
  isUpdatingId,
  onTogglePaid,
  onViewDetails,
  onDeleteClick,
}: BookingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4">Customer</th>
              <th scope="col" className="px-6 py-4">Tour Adventure</th>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Price</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bookings.map((booking) => {
              const customer = extractCustomer(booking.user);
              const tourName = booking.tour?.name || "Unlisted Tour";
              const isUpdating = isUpdatingId === booking._id;

              return (
                <tr
                  key={booking._id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  {/* Customer (Reusing Avatar component) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        photo={customer?.photo}
                        name={customer?.name || "Customer"}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {customer?.name || "Anonymous User"}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {customer?.email ||
                            (typeof booking.user === "string"
                              ? `ID: ${booking.user.slice(0, 8)}...`
                              : "No email")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Tour */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getTourImageUrl(booking.tour?.imageCover)}
                        alt={tourName}
                        className="h-10 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200/60 dark:ring-slate-700"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        {booking.tour?.slug ? (
                          <Link
                            to={`/tours/${booking.tour.slug}`}
                            className="truncate font-semibold text-slate-900 transition hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                          >
                            {tourName}
                          </Link>
                        ) : (
                          <p className="truncate font-semibold text-slate-900 dark:text-white">
                            {tourName}
                          </p>
                        )}
                        {booking.tour?.duration && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {booking.tour.duration} days trip
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(
                        booking.startDate ||
                          booking.tour?.startDates?.[0] ||
                          booking.createdAt,
                      )}
                    </p>
                    <p className="mt-0.5 text-slate-400 dark:text-slate-500">
                      Booked: {formatDate(booking.createdAt)}
                    </p>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(booking.price)}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onTogglePaid(booking)}
                      disabled={isUpdating}
                      title="Click to toggle status"
                      className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                        booking.paid
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                      }`}
                    >
                      {isUpdating ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : booking.paid ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>{booking.paid ? "Paid" : "Pending"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(booking)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(booking)}
                        className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                        title="Delete booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
