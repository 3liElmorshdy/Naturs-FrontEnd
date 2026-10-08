import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "../../../store/store";
import { getMonthlyPlan } from "../../../services/monthlyPlan";
import type { MonthlyPlanItem } from "../../../services/monthlyPlan";
import { getRequestErrorMessage } from "../../../utils/requestError";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function MonthlyPlan() {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [year, setYear] = useState(
    new Date().getFullYear(),
  );

  const [plan, setPlan] = useState<MonthlyPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canAccessPage =
    currentUser?.role === "admin" ||
    currentUser?.role === "lead-guide" ||
    currentUser?.role === "guide";

  async function loadPlan(showRefreshState = false) {
    if (showRefreshState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage("");

    try {
      const loadedPlan = await getMonthlyPlan(year);

      setPlan(loadedPlan);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    if (!canAccessPage) {
      return;
    }

    void loadPlan();
  }, [year, canAccessPage]);

  const planByMonth = useMemo(() => {
    const months = Array.from(
      { length: 12 },
      (_, index) => index + 1,
    );

    return months.map((month) => {
      return (
        plan.find((item) => item.month === month) ??
        ({
          month,
          numToursStart: 0,
          tours: [],
        } as MonthlyPlanItem)
      );
    });
  }, [plan]);

  const totalTourStarts = plan.reduce(
    (total, item) => total + item.numToursStart,
    0,
  );

  const busiestMonth = plan.reduce<MonthlyPlanItem | null>(
    (busiest, item) => {
      if (!busiest || item.numToursStart > busiest.numToursStart) {
        return item;
      }

      return busiest;
    },
    null,
  );

  const maxTourStarts = Math.max(
    ...planByMonth.map((item) => item.numToursStart),
    1,
  );

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPage) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <BarChart3 className="h-4 w-4" />
              Reports
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Monthly tour plan
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              See how many tours start in each month.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setYear((value) => value - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
              aria-label="Previous year"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex h-10 min-w-24 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {year}
            </div>

            <button
              type="button"
              onClick={() => setYear((value) => value + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
              aria-label="Next year"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => void loadPlan(true)}
              disabled={isLoading || isRefreshing}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
              aria-label="Refresh monthly plan"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-8 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Could not load the monthly plan
              </p>

              <p className="mt-1">{errorMessage}</p>

              <button
                type="button"
                onClick={() => void loadPlan()}
                className="mt-3 font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        {!errorMessage && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total tour starts
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? "—" : totalTourStarts}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Across all months in {year}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Busiest month
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading || !busiestMonth
                    ? "—"
                    : MONTH_NAMES[busiestMonth.month - 1]}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {busiestMonth
                    ? `${busiestMonth.numToursStart} tour starts`
                    : "No tour starts yet"}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active months
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                  {isLoading
                    ? "—"
                    : plan.filter(
                        (item) => item.numToursStart > 0,
                      ).length}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Months with scheduled tours
                </p>
              </article>
            </div>

            {/* Monthly chart */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tour starts by month
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Select a month below to see its tours.
                  </p>
                </div>

                <span className="hidden rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 sm:inline-flex">
                  {year}
                </span>
              </div>

              {isLoading ? (
                <div className="mt-8 grid h-64 grid-cols-12 items-end gap-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-t-lg bg-slate-200 dark:bg-slate-700"
                      style={{
                        height: `${30 + ((index * 19) % 120)}px`,
                      }}
                    />
                  ))}
                </div>
              ) : totalTourStarts === 0 ? (
                <div className="mt-8 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center dark:border-slate-700">
                  <CalendarDays className="h-10 w-10 text-slate-300 dark:text-slate-600" />

                  <p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
                    No tours scheduled
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    There are no tour start dates for {year}.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid h-72 grid-cols-12 items-end gap-2 sm:gap-4">
                  {planByMonth.map((item) => {
                    const barHeight =
                      item.numToursStart === 0
                        ? 8
                        : Math.max(
                            18,
                            (item.numToursStart /
                              maxTourStarts) *
                              220,
                          );

                    return (
                      <div
                        key={item.month}
                        className="group flex h-full flex-col items-center justify-end gap-3"
                        title={`${MONTH_NAMES[item.month - 1]}: ${item.numToursStart} tour starts`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 sm:text-xs dark:text-slate-400">
                          {item.numToursStart}
                        </span>

                        <div
                          className={[
                            "w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80",
                            item.numToursStart > 0
                              ? "bg-gradient-to-t from-teal-700 to-teal-400"
                              : "bg-slate-200 dark:bg-slate-700",
                          ].join(" ")}
                          style={{
                            height: `${barHeight}px`,
                          }}
                        />

                        <span className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                          {MONTH_NAMES[item.month - 1]?.slice(
                            0,
                            3,
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Monthly details */}
            <section className="mt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Monthly details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Tours scheduled to start during each month.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {planByMonth.map((item) => (
                  <article
                    key={item.month}
                    className={[
                      "rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-slate-900",
                      item.numToursStart > 0
                        ? "border-teal-200 dark:border-teal-500/30"
                        : "border-slate-200 dark:border-slate-800",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {MONTH_NAMES[item.month - 1]}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.numToursStart} tour start
                          {item.numToursStart === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span
                        className={[
                          "flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-bold",
                          item.numToursStart > 0
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
                        ].join(" ")}
                      >
                        {item.numToursStart}
                      </span>
                    </div>

                    {item.tours.length > 0 ? (
                      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {item.tours.map((tourName: string, index: number) => (
                          <li
                            key={`${tourName}-${index}`}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                            <span>{tourName}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
                        No tours scheduled.
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default MonthlyPlan;