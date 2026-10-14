import { ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { API_ORIGIN } from "../../../../config";
import type Tour from "../../../../types/Tour";

type AdminTourCardProps = {
  tour: Tour;
  onEditClick: (tour: Tour) => void;
  onDeleteClick: (tour: Tour) => void;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  medium:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  difficult:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
};

export function AdminTourCard({
  tour,
  onEditClick,
  onDeleteClick,
}: AdminTourCardProps) {
  const coverUrl = tour.imageCover
    ? `${API_ORIGIN}/img/tours/${tour.imageCover}`
    : "";

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-teal-500/30">
      <div>
        <div className="flex items-start gap-3">
          {/* Thumbnail Image */}
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={tour.name}
              className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-base font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
              {tour.name.charAt(0)}
            </div>
          )}

          {/* Operational Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              {tour.slug ? (
                <Link
                  to={`/tours/${tour.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 truncate text-sm font-bold text-slate-900 transition hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                  title={`View "${tour.name}" as customer`}
                >
                  <span className="truncate">{tour.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100 text-teal-600 dark:text-teal-400" />
                </Link>
              ) : (
                <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {tour.name}
                </h3>
              )}

              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold capitalize ${
                  DIFFICULTY_COLORS[tour.difficulty] || DIFFICULTY_COLORS.easy
                }`}
              >
                {tour.difficulty}
              </span>
            </div>

            {/* Operational Metrics: Duration, Price, Location */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ${tour.price}
              </span>
              <span>•</span>
              <span>{tour.duration} days</span>
              {tour.startLocation?.description && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="truncate">
                      {tour.startLocation.description}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Actions: Edit & Delete */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => onEditClick(tour)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/25 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          title={`Edit ${tour.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit Tour</span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteClick(tour)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          aria-label={`Delete ${tour.name}`}
          title={`Delete ${tour.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}

export default AdminTourCard;
