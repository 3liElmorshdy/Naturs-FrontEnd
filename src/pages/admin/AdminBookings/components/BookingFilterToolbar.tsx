import {
  ArrowUpDown,
  LayoutGrid,
  Search,
  Table as TableIcon,
  X,
} from "lucide-react";
import React from "react";

import type {
  BookingSortOption,
  BookingStatusFilter,
  BookingViewMode,
} from "../types";

interface BookingFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: BookingStatusFilter;
  onStatusFilterChange: (status: BookingStatusFilter) => void;
  sortBy: BookingSortOption;
  onSortChange: (sort: BookingSortOption) => void;
  viewMode: BookingViewMode;
  onViewModeChange: (mode: BookingViewMode) => void;
  totalCount: number;
  paidCount: number;
  pendingCount: number;
}

export function BookingFilterToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  paidCount,
  pendingCount,
}: BookingFilterToolbarProps) {
  return (
    <section
      aria-label="Filter and search controls"
      className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer name, email, tour, or booking ID..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter Tabs */}
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-800"
          role="group"
          aria-label="Filter by payment status"
        >
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`rounded-lg px-3 py-1.5 transition ${
              statusFilter === "all"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("paid")}
            className={`rounded-lg px-3 py-1.5 transition ${
              statusFilter === "paid"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Paid ({paidCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("pending")}
            className={`rounded-lg px-3 py-1.5 transition ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as BookingSortOption)}
            className="bg-transparent text-slate-700 focus:outline-none dark:text-slate-200"
            aria-label="Sort bookings"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>

        {/* View Mode Toggle (Table / Grid) */}
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-lg p-1.5 transition ${
              viewMode === "table"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-lg p-1.5 transition ${
              viewMode === "grid"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
