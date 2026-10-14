import { Search } from "lucide-react";
import React from "react";

export const DIFFICULTY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Difficult", value: "difficult" },
] as const;

type TourFilterToolbarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  placeholder?: string;
};

export function TourFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  placeholder = "Search tours by name...",
}: TourFilterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
        />
      </div>

      {/* Difficulty Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {DIFFICULTY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onDifficultyChange(filter.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedDifficulty === filter.value
                ? "bg-slate-900 text-white shadow-sm dark:bg-teal-500 dark:text-slate-950"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TourFilterToolbar;
