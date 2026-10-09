import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { inputClassName } from "../utils";

type ScheduleSectionProps = {
  startDates: string[];
  startDateCount: number;
  fieldErrors: Record<string, string>;
  onUpdateStartDate: (index: number, value: string) => void;
  onAddStartDate: () => void;
  onRemoveStartDate: (index: number) => void;
  onBlur: () => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function ScheduleSection({
  startDates,
  startDateCount,
  fieldErrors,
  onUpdateStartDate,
  onAddStartDate,
  onRemoveStartDate,
  onBlur,
  renderFieldError,
}: ScheduleSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <CalendarDays className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Set available dates for future bookings.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {startDates.map((date, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="datetime-local"
              value={date}
              onChange={(event) =>
                onUpdateStartDate(index, event.target.value)
              }
              onBlur={onBlur}
              className={inputClassName(
                Boolean(fieldErrors.startDates),
              )}
            />

            <button
              type="button"
              onClick={() => onRemoveStartDate(index)}
              disabled={startDates.length === 1}
              title={
                startDates.length === 1
                  ? "At least one start date is required"
                  : `Remove start date ${index + 1}`
              }
              className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              aria-label={`Remove start date ${index + 1}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {renderFieldError("startDates")}

      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        {startDateCount} start date
        {startDateCount === 1 ? "" : "s"} added.
      </p>

      <button
        type="button"
        onClick={onAddStartDate}
        className="mt-5 group flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
        Add Start Date
      </button>
    </section>
  );
}

export default ScheduleSection;
