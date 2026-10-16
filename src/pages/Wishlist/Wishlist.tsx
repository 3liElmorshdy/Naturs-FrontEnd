import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWishlist } from "../../store/wishlistSlice";
import type { AppDispatch, RootState } from "../../store/store";
import {
  WishlistHeader,
  WishlistSkeleton,
  EmptyWishlistState,
  WishlistErrorBanner,
  WishlistGrid,
} from "./components";

export { WishlistSkeleton, EmptyWishlistState };

export function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.wishlist,
  );

  useEffect(() => {
    void dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRefresh = () => {
    void dispatch(fetchWishlist());
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ── */}
        <WishlistHeader
          itemCount={items.length}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />

        {/* ── Error Banner ── */}
        {error && (
          <WishlistErrorBanner error={error} onRetry={handleRefresh} />
        )}

        {/* ── Main Content Area ── */}
        {isLoading ? (
          <WishlistSkeleton />
        ) : items.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <WishlistGrid tours={items} />
        )}
      </div>
    </main>
  );
}

export default Wishlist;
