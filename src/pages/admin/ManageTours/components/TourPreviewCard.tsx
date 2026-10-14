import {
  Calendar,
  Compass,
  MapPin,
  Sparkles,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import React from "react";
import type { TourFormState } from "../types";

type TourPreviewCardProps = {
  form: TourFormState;
  coverPreview: string;
  galleryImageCount: number;
  startDateCount: number;
  selectedGuideNames: string[];
  generatedSlug: string;
};

export function TourPreviewCard({
  form,
  coverPreview,
  galleryImageCount,
  startDateCount,
  selectedGuideNames,
  generatedSlug,
}: TourPreviewCardProps) {
  const difficultyColors = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    difficult: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50/75 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Live Tour Preview</span>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Review before publishing
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cover Preview Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 lg:col-span-5">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Tour cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
                <Compass className="h-10 w-10 stroke-[1.5] text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs font-medium">Cover image preview</p>
                <p className="text-[11px] text-slate-400">
                  Select a cover file above
                </p>
              </div>
            )}

            <span
              className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize shadow-sm backdrop-blur-md ${
                difficultyColors[form.difficulty] || difficultyColors.easy
              }`}
            >
              {form.difficulty || "easy"}
            </span>
          </div>

          {/* Tour Details Overview */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {form.name.trim() || "Untitled Adventure Tour"}
              </h4>

              {generatedSlug && (
                <p className="mt-1 font-mono text-xs text-teal-600 dark:text-teal-400">
                  /tours/{generatedSlug}
                </p>
              )}

              <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                {form.summary.trim() ||
                  "Tour summary will appear here once entered in Step 1."}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <p className="text-[11px] font-medium text-slate-400">Price</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ${form.price || "0"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <p className="text-[11px] font-medium text-slate-400">Duration</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {form.duration || "0"} Days
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <p className="text-[11px] font-medium text-slate-400">Group Size</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Up to {form.maxGroupSize || "0"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <p className="text-[11px] font-medium text-slate-400">Gallery</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {galleryImageCount} Photos
                </p>
              </div>
            </div>

            {/* Additional Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="truncate max-w-[200px]">
                  {form.startLocationDescription.trim() || "No location set"}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {selectedGuideNames.length > 0
                    ? `${selectedGuideNames.length} guides assigned`
                    : "No guides selected"}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {startDateCount > 0
                    ? `${startDateCount} start dates`
                    : "No dates set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourPreviewCard;
