import { Map } from "lucide-react";
import type { TourFormState } from "../types";
import { inputClassName } from "../utils";

type BasicInformationSectionProps = {
  form: TourFormState;
  fieldErrors: Record<string, string>;
  generatedSlug: string;
  onChange: (field: keyof TourFormState, value: string) => void;
  onBlur: (field: keyof TourFormState) => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function BasicInformationSection({
  form,
  fieldErrors,
  generatedSlug,
  onChange,
  onBlur,
  renderFieldError,
}: BasicInformationSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <Map className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Essential details that define the tour.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tour Name
          </span>

          <input
            type="text"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            onBlur={() => onBlur("name")}
            placeholder="The Mansoura Explorer"
            className={inputClassName(Boolean(fieldErrors.name))}
          />

          {renderFieldError("name")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Slug
          </span>

          <input
            type="text"
            value={form.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            onBlur={() => onBlur("slug")}
            placeholder="the-mansoura-explorer"
            className={inputClassName(Boolean(fieldErrors.slug))}
          />

          {renderFieldError("slug")}

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Tour URL:{" "}
            <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">
              /tours/{generatedSlug || "your-tour-slug"}
            </span>
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Difficulty
          </span>

          <select
            value={form.difficulty}
            onChange={(event) => onChange("difficulty", event.target.value)}
            className={inputClassName(Boolean(fieldErrors.difficulty))}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </select>

          {renderFieldError("difficulty")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Duration in Days
          </span>

          <input
            type="number"
            min="1"
            value={form.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            onBlur={() => onBlur("duration")}
            placeholder="4"
            className={inputClassName(Boolean(fieldErrors.duration))}
          />

          {renderFieldError("duration")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Maximum Group Size
          </span>

          <input
            type="number"
            min="1"
            value={form.maxGroupSize}
            onChange={(event) => onChange("maxGroupSize", event.target.value)}
            onBlur={() => onBlur("maxGroupSize")}
            placeholder="12"
            className={inputClassName(Boolean(fieldErrors.maxGroupSize))}
          />

          {renderFieldError("maxGroupSize")}
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Price in USD
          </span>

          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => onChange("price", event.target.value)}
            onBlur={() => onBlur("price")}
            placeholder="399"
            className={inputClassName(Boolean(fieldErrors.price))}
          />

          {renderFieldError("price")}
        </label>
      </div>
    </section>
  );
}

export default BasicInformationSection;
