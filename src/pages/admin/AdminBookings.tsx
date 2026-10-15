import {
  AlertCircle,
  ChevronLeft,
  Plus,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import {
  BookingDetailsModal,
  BookingEmptyState,
  BookingFilterToolbar,
  BookingGrid,
  BookingSkeleton,
  BookingStats,
  BookingTable,
  CreateBookingModal,
  DeleteBookingModal,
} from "./AdminBookings/components";
import { useAdminBookings } from "./AdminBookings/hooks";

export function AdminBookings() {
  const {
    bookings,
    filteredBookings,
    isLoading,
    errorMessage,
    stats,
    isFiltered,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedBooking,
    setSelectedBooking,
    bookingToDelete,
    setBookingToDelete,
    isDeleting,
    isUpdatingId,
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchBookings,
    handleTogglePaidStatus,
    handleDeleteBooking,
  } = useAdminBookings();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Top Breadcrumb ── */}
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* ── Page Header ── */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              <ReceiptText className="h-4 w-4" />
              <span>Management Center</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              All Customer Bookings
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Track reservations, manage customer booking records, and control payment statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => void fetchBookings()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Refresh bookings"
            >
              <RefreshCw
                className={`h-4 w-4 text-teal-600 dark:text-teal-400 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            {/* Create Booking Button */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Booking</span>
            </button>
          </div>
        </header>

        {/* ── KPI Summary Cards ── */}
        <BookingStats stats={stats} />

        {/* ── Search, Filters, and Layout Bar ── */}
        <BookingFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={bookings.length}
          paidCount={stats.paidCount}
          pendingCount={stats.pendingCount}
        />

        {/* ── Error Banner ── */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-8 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Failed to load bookings</p>
                <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void fetchBookings()}
              className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Main Bookings Content ── */}
        {isLoading ? (
          <BookingSkeleton />
        ) : filteredBookings.length === 0 ? (
          <BookingEmptyState
            isFiltered={isFiltered}
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          />
        ) : viewMode === "table" ? (
          <BookingTable
            bookings={filteredBookings}
            isUpdatingId={isUpdatingId}
            onTogglePaid={(b) => void handleTogglePaidStatus(b)}
            onViewDetails={setSelectedBooking}
            onDeleteClick={setBookingToDelete}
          />
        ) : (
          <BookingGrid
            bookings={filteredBookings}
            isUpdatingId={isUpdatingId}
            onTogglePaid={(b) => void handleTogglePaidStatus(b)}
            onViewDetails={setSelectedBooking}
            onDeleteClick={setBookingToDelete}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      <DeleteBookingModal
        booking={bookingToDelete}
        isDeleting={isDeleting}
        onCancel={() => setBookingToDelete(null)}
        onConfirm={() => void handleDeleteBooking()}
      />

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void fetchBookings()}
      />
    </main>
  );
}

export default AdminBookings;
