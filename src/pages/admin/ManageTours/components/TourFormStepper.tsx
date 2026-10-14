import { AlertCircle, Check, Compass, CalendarDays, Sparkles } from "lucide-react";
import React from "react";

export type StepDef = {
  id: number;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: string[];
};

export const TOUR_FORM_STEPS: StepDef[] = [
  {
    id: 0,
    label: "Basic Info & Overview",
    subtitle: "Name, pricing, group & details",
    icon: Compass,
    fields: [
      "name",
      "slug",
      "duration",
      "maxGroupSize",
      "difficulty",
      "price",
      "summary",
      "description",
    ],
  },
  {
    id: 1,
    label: "Dates & Logistics",
    subtitle: "Start location, guides & dates",
    icon: CalendarDays,
    fields: [
      "startLocationDescription",
      "startLocationLongitude",
      "startLocationLatitude",
      "guides",
      "startDates",
    ],
  },
  {
    id: 2,
    label: "Media & Review",
    subtitle: "Photos, preview & publish",
    icon: Sparkles,
    fields: ["imageCover", "images"],
  },
];

type TourFormStepperProps = {
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  fieldErrors: Record<string, string>;
  isStepCompleted: (stepIndex: number) => boolean;
};

export function TourFormStepper({
  currentStep,
  onStepClick,
  fieldErrors,
  isStepCompleted,
}: TourFormStepperProps) {
  return (
    <nav
      aria-label="Tour creation steps"
      className="mt-8 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
    >
      {TOUR_FORM_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === index;
        const isCompleted = isStepCompleted(index);
        const errorCount = step.fields.filter((field) =>
          Boolean(fieldErrors[field]),
        ).length;
        const hasErrors = errorCount > 0;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick(index)}
            aria-current={isActive ? "step" : undefined}
            className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              isActive
                ? "border-teal-500 bg-teal-50/60 shadow-sm ring-1 ring-teal-500/20 dark:border-teal-400 dark:bg-teal-950/25 dark:ring-teal-400/20"
                : hasErrors
                  ? "border-rose-200 bg-white hover:border-rose-300 dark:border-rose-900/50 dark:bg-slate-900"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            }`}
          >
            {/* Step Icon or Status */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                isActive
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/25"
                  : hasErrors
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {isCompleted && !hasErrors ? (
                <Check className="h-5 w-5 stroke-[2.5]" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>

            {/* Step Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? "text-teal-700 dark:text-teal-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  Step {index + 1}
                </span>

                {hasErrors && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                    <AlertCircle className="h-3 w-3" />
                    {errorCount} {errorCount === 1 ? "error" : "errors"}
                  </span>
                )}

                {isCompleted && !hasErrors && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Completed
                  </span>
                )}
              </div>

              <h3
                className={`mt-1 truncate text-sm font-bold sm:text-base ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {step.label}
              </h3>

              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {step.subtitle}
              </p>
            </div>

            {/* Bottom active line */}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-teal-500 dark:bg-teal-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default TourFormStepper;
