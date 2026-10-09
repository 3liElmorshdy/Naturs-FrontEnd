import { Map } from "lucide-react";

import type { TourFormState } from "../types";
import { inputClassName } from "../utils";

type StartLocationSectionProps = {
  form: TourFormState;
  fieldErrors: Record<string, string>;
  onChange: (field: keyof TourFormState, value: string) => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function StartLocationSection({
  form,
  fieldErrors,
  onChange,
  renderFieldError,
}: StartLocationSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <Map className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Start Location
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter the starting point of this tour.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Location Description
          </span>

          <input
            type="text"
            value={form.startLocationDescription}
            onChange={(event) =>
              onChange("startLocationDescription", event.target.value)
            }
            placeholder="Mansoura, Egypt"
            className={inputClassName(
              Boolean(fieldErrors.startLocationDescription),
            )}
          />

          {renderFieldError("startLocationDescription")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Longitude
          </span>

          <input
            type="number"
            step="any"
            value={form.startLocationLongitude}
            onChange={(event) =>
              onChange("startLocationLongitude", event.target.value)
            }
            placeholder="31.0409"
            className={inputClassName(
              Boolean(fieldErrors.startLocationLongitude),
            )}
          />

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Example: 31.0409
          </p>

          {renderFieldError("startLocationLongitude")}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Latitude
          </span>

          <input
            type="number"
            step="any"
            value={form.startLocationLatitude}
            onChange={(event) =>
              onChange("startLocationLatitude", event.target.value)
            }
            placeholder="31.3785"
            className={inputClassName(
              Boolean(fieldErrors.startLocationLatitude),
            )}
          />

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Example: 31.3785
          </p>

          {renderFieldError("startLocationLatitude")}
        </label>
      </div>
    </section>
  );
}

export default StartLocationSection;
