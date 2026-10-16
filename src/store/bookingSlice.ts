import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Tour } from "../types";

export interface BookingState {
  tours: Tour[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  tours: [],
  isLoading: false,
  error: null,
};

/**
 * Async thunk to fetch booked tours for the currently authenticated user.
 * Sends GET request to /api/v1/bookings/my-tours (via api instance with withCredentials & Bearer token).
 * Gracefully falls back to /bookings/my-bookings if /my-tours returns 404.
 */
export const fetchMyBookings = createAsyncThunk<
  Tour[],
  void,
  { rejectValue: string }
>("bookings/fetchMyBookings", async (_, { rejectWithValue }) => {
  try {
    // The backend route in bookingROut.js is /api/v1/bookings/my-bookings
    const response = await api.get("/bookings/my-bookings");


    // Support multiple backend response formats:
    // 1) { status: "success", data: { data: [...] } }
    // 2) { status: "success", data: [...] }
    // 3) direct array [...]
    const payload = response.data?.data?.data ?? response.data?.data ?? response.data;

    if (!Array.isArray(payload)) {
      return [];
    }

    // If backend returns populated booking objects ({ tour: { ... } }), extract tour.
    // If backend returns Tour objects directly, keep as is.
    const tours: Tour[] = payload
      .map((item: any) => {
        if (item && typeof item === "object" && "tour" in item && item.tour) {
          return item.tour as Tour;
        }
        return item as Tour;
      })
      .filter((tour): tour is Tour => Boolean(tour && tour._id));

    return tours;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return rejectWithValue("Please sign in to view your bookings.");
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Unable to load your bookings. Please try again.";

    return rejectWithValue(message);
  }
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetBookings: (state) => {
      state.tours = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action: PayloadAction<Tour[]>) => {
        state.isLoading = false;
        state.tours = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load bookings";
      });
  },
});

export const { clearBookingError, resetBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
