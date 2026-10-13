type TourSetupProgressProps = {
  progress: number;
};

function TourSetupProgress({ progress }: TourSetupProgressProps) {
  return (
    <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Tour setup progress
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Complete the main fields before publishing.
          </p>
        </div>

        <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
          {progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default TourSetupProgress;
