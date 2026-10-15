import React from "react";

export function BookingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((idx) => (
        <div
          key={idx}
          className="h-20 w-full animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
        />
      ))}
    </div>
  );
}
