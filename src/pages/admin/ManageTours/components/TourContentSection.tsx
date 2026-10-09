import { Map } from "lucide-react";
import type { TourFormState } from "../types";
import { inputClassName } from "../utils";

type TourContentSectionProps = {
  form: TourFormState;
  fieldErrors: Record<string, string>;
  onChange: (field: keyof TourFormState, value: string) => void;
  onBlur: (field: keyof TourFormState) => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function TourContentSection({
  form,
  fieldErrors,
  onChange,
  onBlur,
  renderFieldError,
}: TourContentSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <Map className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tour Content
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add a persuasive summary and complete description.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Summary
          </span>

          <textarea
            rows={2}
            value={form.summary}
            onChange={(event) => onChange("summary", event.target.value)}
            onBlur={() => onBlur("summary")}
            placeholder="Discover Mansoura's Nile-side charm, historic streets, local food, and Delta culture."
            className={`${inputClassName(
              Boolean(fieldErrors.summary),
            )} resize-none`}
          />

          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Short, persuasive text for tour cards.
            </span>

            <span
              className={[
                "shrink-0 text-xs font-bold",
                form.summary.trim().length < 20
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-teal-600 dark:text-teal-400",
              ].join(" ")}
            >
              {form.summary.trim().length} / 20 minimum
            </span>
          </div>

          {renderFieldError("summary")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Description
          </span>

          <textarea
            rows={6}
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            onBlur={() => onBlur("description")}
            placeholder="Write a detailed description of the experience, activities, locations, and what makes this tour special..."
            className={`${inputClassName(
              Boolean(fieldErrors.description),
            )} resize-none`}
          />

          <div className="mt-1.5 flex justify-end">
            <span
              className={[
                "text-xs font-bold",
                form.description.trim().length < 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-teal-600 dark:text-teal-400",
              ].join(" ")}
            >
              {form.description.trim().length} / 50 minimum
            </span>
          </div>

          {renderFieldError("description")}
        </label>
      </div>
    </section>
  );
}

export default TourContentSection;
