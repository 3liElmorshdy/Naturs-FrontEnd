import React from "react";
import type Tour from "../../../types/Tour";
import { TourCard } from "../../../components/TourCard/TourCard";

interface WishlistGridProps {
  tours: Tour[];
}

export function WishlistGrid({ tours }: WishlistGridProps) {
  return (
    <section
      aria-label="Saved tours list"
      className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      {tours.map((tour) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </section>
  );
}

export default WishlistGrid;
