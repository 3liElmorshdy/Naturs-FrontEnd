// hooks/Tour/useFilteredTours.ts  →  re-exported as useTourFilters
import { useState, useMemo } from 'react';
import type Tour from '../../types/Tour';


export function useTourFilters(allTours: Tour[] | undefined) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("price-asc");

  const isFiltered = search.trim() !== "" || difficulty !== "all" || minRating > 0;

  const clearFilters = () => {
    setSearch("");
    setDifficulty("all");
    setMinRating(0);
  };

  const filteredTours = useMemo(() => {
    if (!allTours) return [];
    let tours = [...allTours];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      tours = tours.filter(t => t.name.toLowerCase().includes(q));
    }

    // Difficulty
    if (difficulty !== "all") tours = tours.filter(t => t.difficulty === difficulty);

    // Min rating
    if (minRating > 0) tours = tours.filter(t => t.ratingsAverage >= minRating);

    // Sorting
    switch (sortBy) {
      case "price-asc":  tours.sort((a, b) => a.price - b.price); break;
      case "price-desc": tours.sort((a, b) => b.price - a.price); break;
      case "rating":     tours.sort((a, b) => b.ratingsAverage - a.ratingsAverage); break;
      case "duration":   tours.sort((a, b) => a.duration - b.duration); break;
    }

    return tours;
  }, [allTours, search, difficulty, minRating, sortBy]);

  return {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    isFiltered,
    clearFilters,
    filteredTours,
  };
}