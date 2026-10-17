import { ArrowLeft, Map, Plus } from "lucide-react";
import React from "react";

type TourManagementHeaderProps = {
  activeView: "catalog" | "create";
  isEditing: boolean;
  editingTourName?: string;
  userRole: string;
  onOpenCreate: () => void;
  onCancelCreate: () => void;
};

export function TourManagementHeader({
  activeView,
  isEditing,
  editingTourName,
  userRole,
  onOpenCreate,
  onCancelCreate,
}: TourManagementHeaderProps) {
  const title =
    activeView === "create"
      ? isEditing
        ? "Edit Tour"
        : "Create New Tour"
      : "Tours Catalog";

  const subtitle =
    activeView === "create"
      ? isEditing
        ? `Update information and settings for "${editingTourName || "this tour"}".`
        : "Follow the 3-step setup to publish a new adventure to the catalog."
      : "Browse, view, and manage all adventures in Tejwal.";

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shadow-sm dark:bg-teal-500/20 dark:text-teal-400">
            <Map className="h-5 w-5" />
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            Tour Management
          </p>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
          </span>
          {userRole.replace("-", " ")}
        </div>

        {activeView === "catalog" && (
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Tour</span>
          </button>
        )}

        {activeView === "create" && (
          <button
            type="button"
            onClick={onCancelCreate}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TourManagementHeader;
