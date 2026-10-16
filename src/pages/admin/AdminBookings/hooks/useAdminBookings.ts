import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  deleteBooking,
  getAllBookings,
  getBookingErrorMessage,
  updateBooking,
  type Booking,
} from "../../../../services/bookingApi";
import type {
  BookingSortOption,
  BookingStatsData,
  BookingStatusFilter,
  BookingViewMode,
} from "../types";
import { extractCustomer, formatCurrency } from "../utils";

export function useAdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Filters, sorting, and layout mode
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<BookingStatusFilter>("all");
  const [sortBy, setSortBy] = useState<BookingSortOption>("newest");
  const [viewMode, setViewMode] = useState<BookingViewMode>("table");

  // Modals and action states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  // Fetch all bookings from backend
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      setErrorMessage(getBookingErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  // Aggregate KPI stats
  const stats: BookingStatsData = useMemo(() => {
    const total = bookings.length;
    const paidBookings = bookings.filter((b) => b.paid);
    const paidCount = paidBookings.length;
    const pendingCount = total - paidCount;
    const totalRevenue = paidBookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0,
    );

    return {
      total,
      paidCount,
      pendingCount,
      totalRevenue,
    };
  }, [bookings]);

  // Filter & sort logic
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (statusFilter === "paid" && !booking.paid) return false;
        if (statusFilter === "pending" && booking.paid) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();

        const customer = extractCustomer(booking.user);
        const customerName = customer?.name?.toLowerCase() || "";
        const customerEmail = customer?.email?.toLowerCase() || "";
        const tourName = booking.tour?.name?.toLowerCase() || "";
        const bookingId = booking._id.toLowerCase();

        return (
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          tourName.includes(q) ||
          bookingId.includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (sortBy === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortBy === "price-desc") {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === "price-asc") {
          return (a.price || 0) - (b.price || 0);
        }
        return 0;
      });
  }, [bookings, statusFilter, searchQuery, sortBy]);

  // Toggle paid status
  const handleTogglePaidStatus = async (booking: Booking) => {
    const newPaidStatus = !booking.paid;
    setIsUpdatingId(booking._id);

    try {
      const updated = await updateBooking(booking._id, {
        paid: newPaidStatus,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, paid: updated.paid } : b,
        ),
      );
      toast.success(
        newPaidStatus
          ? `Booking marked as Paid (${formatCurrency(booking.price)})`
          : "Booking marked as Payment Pending",
      );
    } catch (error) {
      toast.error(getBookingErrorMessage(error));
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Confirm delete booking
  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    setIsDeleting(true);

    try {
      await deleteBooking(bookingToDelete._id);
      setBookings((prev) =>
        prev.filter((b) => b._id !== bookingToDelete._id),
      );
      toast.success("Booking deleted successfully");
      setBookingToDelete(null);
    } catch (error) {
      toast.error(getBookingErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = Boolean(searchQuery || statusFilter !== "all");

  return {
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
    fetchBookings,
    handleTogglePaidStatus,
    handleDeleteBooking,
  };
}

