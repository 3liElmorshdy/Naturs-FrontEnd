import { Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

import type Tour from "../../../../types/Tour";
import AdminTourCard from "./AdminTourCard";
import TourFilterToolbar from "./TourFilterToolbar";

type ExistingToursSectionProps = {
  tours: Tour[];
  isLoadingTours: boolean;
  onDeleteClick: (tour: Tour) => void;
  onEditClick: (tour: Tour) => void;
  onCreateClick?: () => void;
};

export function ExistingToursSection({
  tours,
  isLoadingTours,
  onDeleteClick,
  onEditClick,
  onCreateClick,
}: ExistingToursSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tour.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        tour.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [tours, searchQuery, selectedDifficulty]);

  return (
    <section className="space-y-6">
      {/* ─── Header & Create CTA ─────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Existing Tours
            </h2>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {tours.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Click tour title to view customer page, or use operational actions.
          </p>
        </div>

        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create New Tour</span>
          </button>
        )}
      </div>

      {/* ─── Reusable Unified Control Toolbar ───────────────────── */}
      <TourFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
      />

      {/* ─── Tours List / Cards Grid ────────────────────────────── */}
      {isLoadingTours ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400" />
          <span>Loading catalog tours...</span>
        </div>
      ) : tours.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No tours found in catalog.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Start by creating the first tour for Tejwal.
          </p>
          {onCreateClick && (
            <button
              type="button"
              onClick={onCreateClick}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Tour</span>
            </button>
          )}
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="flex h-36 flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No tours match &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
            }}
            className="mt-2 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {filteredTours.map((tour) => (
            <AdminTourCard
              key={tour._id}
              tour={tour}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExistingToursSection;
