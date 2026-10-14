import React from "react";

type TourCatalogStatsProps = {
  total: number;
  easy: number;
  medium: number;
  difficult: number;
};

export function TourCatalogStats({
  total,
  easy,
  medium,
  difficult,
}: TourCatalogStatsProps) {
  const stats = [
    {
      label: "Total Tours",
      value: total,
      colorClass: "text-slate-400 dark:text-slate-500",
      valueColorClass: "text-slate-900 dark:text-white",
    },
    {
      label: "Easy",
      value: easy,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      valueColorClass: "text-slate-900 dark:text-white",
    },
    {
      label: "Medium",
      value: medium,
      colorClass: "text-amber-600 dark:text-amber-400",
      valueColorClass: "text-slate-900 dark:text-white",
    },
    {
      label: "Difficult",
      value: difficult,
      colorClass: "text-rose-600 dark:text-rose-400",
      valueColorClass: "text-slate-900 dark:text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900"
        >
          <p
            className={`text-xs font-bold uppercase tracking-wider ${stat.colorClass}`}
          >
            {stat.label}
          </p>
          <p
            className={`mt-1 text-2xl font-extrabold ${stat.valueColorClass}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TourCatalogStats;
