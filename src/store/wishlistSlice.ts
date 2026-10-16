import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Tour } from "../types";
import toast from "react-hot-toast";

export interface WishlistState {
  items: Tour[];
  itemIds: string[];
  isLoading: boolean;
  togglingId: string | null;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  itemIds: [],
  isLoading: false,
  togglingId: null,
  error: null,
};

/**
 * Fetch full populated wishlist for the logged-in user.
 * GET /api/v1/users/wishlist
 */
export const fetchWishlist = createAsyncThunk<
  Tour[],
  void,
  { rejectValue: string }
>("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users/wishlist");
    const rawWishlist = response.data?.data?.wishlist ?? [];

    if (!Array.isArray(rawWishlist)) {
      return [];
    }

    return rawWishlist as Tour[];
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to load wishlist.";
    return rejectWithValue(message);
  }
});

/**
 * Toggle tour in wishlist (optimistic update + server sync).
 */
export const toggleWishlist = createAsyncThunk<
  { tourId: string; wasAdded: boolean; tour: Tour },
  Tour,
  { rejectValue: { tourId: string; message: string; wasAdded: boolean } }
>("wishlist/toggleWishlist", async (tour, { getState, rejectWithValue }) => {
  const state = getState() as { wishlist: WishlistState };
  const tourId = tour._id;
  const isCurrentlyInWishlist = state.wishlist.itemIds.includes(tourId);

  try {
    if (isCurrentlyInWishlist) {
      // DELETE /api/v1/users/wishlist/:tourId
      await api.delete(`/users/wishlist/${tourId}`);
      toast.success("Removed from wishlist");
      return { tourId, wasAdded: false, tour };
    } else {
      // POST /api/v1/users/wishlist/:tourId
      await api.post(`/users/wishlist/${tourId}`);
      toast.success("Added to wishlist ❤️");
      return { tourId, wasAdded: true, tour };
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update wishlist.";
    toast.error(message);
    return rejectWithValue({
      tourId,
      message,
      wasAdded: !isCurrentlyInWishlist,
    });
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.items = [];
      state.itemIds = [];
      state.isLoading = false;
      state.togglingId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<Tour[]>) => {
          state.isLoading = false;
          state.items = action.payload;
          state.itemIds = action.payload
            .map((t) => (typeof t === "string" ? t : t._id))
            .filter(Boolean);
          state.error = null;
        },
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load wishlist";
      });

    // Toggle Wishlist - Optimistic update in pending
    builder
      .addCase(toggleWishlist.pending, (state, action) => {
        const tour = action.meta.arg;
        const tourId = tour._id;
        state.togglingId = tourId;

        const exists = state.itemIds.includes(tourId);
        if (exists) {
          state.itemIds = state.itemIds.filter((id) => id !== tourId);
          state.items = state.items.filter((item) => item._id !== tourId);
        } else {
          state.itemIds.push(tourId);
          state.items.push(tour);
        }
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.togglingId = null;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.togglingId = null;
        // Rollback optimistic update if failed
        if (action.payload) {
          const { tourId, wasAdded } = action.payload;
          if (wasAdded) {
            // It tried to add, so remove it back
            state.itemIds = state.itemIds.filter((id) => id !== tourId);
            state.items = state.items.filter((item) => item._id !== tourId);
          } else {
            // It tried to remove, so add it back
            if (!state.itemIds.includes(tourId)) {
              state.itemIds.push(tourId);
            }
          }
        }
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
