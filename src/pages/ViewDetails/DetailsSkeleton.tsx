export function DetailsSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-50 dark:bg-slate-950">
      <div className="h-72 bg-slate-200 dark:bg-slate-700 sm:h-96" />

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-10">
        <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}