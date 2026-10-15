import {
  CheckCircle2,
  Clock,
  DollarSign,
  ReceiptText,
} from "lucide-react";
import React from "react";

import type { BookingStatsData } from "../types";
import { formatCurrency } from "../utils";

interface BookingStatsProps {
  stats: BookingStatsData;
}

export function BookingStats({ stats }: BookingStatsProps) {
  const successRate =
    stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0;

  return (
    <section
      aria-label="Bookings summary stats"
      className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {/* Total Bookings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Bookings
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <ReceiptText className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          {stats.total}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Total reservations made
        </p>
      </div>

      {/* Total Revenue */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Revenue
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
          {formatCurrency(stats.totalRevenue)}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          From {stats.paidCount} paid bookings
        </p>
      </div>

      {/* Paid Bookings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Paid Bookings
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          {stats.paidCount}
        </p>
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          {successRate}% success rate
        </p>
      </div>

      {/* Pending Payment */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending Payment
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          {stats.pendingCount}
        </p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          Awaiting confirmation
        </p>
      </div>
    </section>
  );
}
