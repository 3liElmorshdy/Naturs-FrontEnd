import {
  ExternalLink,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { API_ORIGIN } from "../../../../config";
import type Tour from "../../../../types/Tour";

type ExistingToursSectionProps = {
  tours: Tour[];
  isLoadingTours: boolean;
  onDeleteClick: (tour: Tour) => void;
  onCreateClick?: () => void;
};

const DIFFICULTY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Difficult", value: "difficult" },
] as const;

export function ExistingToursSection({
  tours,
  isLoadingTours,
  onDeleteClick,
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

  const difficultyColors: Record<string, string> = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    medium:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    difficult:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Existing Tours Catalog
            </h2>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
              {tours.length} {tours.length === 1 ? "tour" : "tours"}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse, inspect, and manage all tours in the catalog.
          </p>
        </div>

        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create New Tour</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            Difficulty:
          </span>
          {DIFFICULTY_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedDifficulty(filter.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedDifficulty === filter.value
                  ? "bg-slate-900 text-white shadow-sm dark:bg-teal-500 dark:text-slate-950"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tours List Content */}
      {isLoadingTours ? (
        <div className="mt-6 flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400" />
          <span>Loading catalog tours...</span>
        </div>
      ) : tours.length === 0 ? (
        <div className="mt-6 flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No tours found in catalog.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Start by creating the first tour for Natours.
          </p>
          {onCreateClick && (
            <button
              type="button"
              onClick={onCreateClick}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Tour</span>
            </button>
          )}
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="mt-6 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
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
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredTours.map((tour) => {
            const coverUrl = tour.imageCover
              ? `${API_ORIGIN}/img/tours/${tour.imageCover}`
              : "";

            return (
              <article
                key={tour._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-teal-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={tour.name}
                          className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-bold">
                          {tour.name.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {tour.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span>{tour.duration} days</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            ${tour.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${
                        difficultyColors[tour.difficulty] ||
                        difficultyColors.easy
                      }`}
                    >
                      {tour.difficulty}
                    </span>
                  </div>

                  {tour.summary && (
                    <p className="mt-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                      {tour.summary}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {tour.startLocation?.description && (
                      <span className="inline-flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate">
                          {tour.startLocation.description}
                        </span>
                      </span>
                    )}

                    {tour.maxGroupSize && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>Up to {tour.maxGroupSize}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  {tour.slug ? (
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 transition hover:text-teal-700 hover:underline dark:text-teal-400"
                    >
                      <span>View Tour Page</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteClick(tour)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    aria-label={`Delete ${tour.name}`}
                    title={`Delete ${tour.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ExistingToursSection;
