import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Map,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import type { RootState } from "../../store/store";
import type User from "../../types/User";
import {
  canAccessManagementDashboard,
  canManageTours,
  canViewMonthlyPlan,
  isAdmin,
} from "../../utils/permissions";

function AdminDashboard() {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;

  const role = user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessManagementDashboard(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const isCurrentUserAdmin = isAdmin(role);
  const canManageCurrentUserTours = canManageTours(role);
  const canViewCurrentUserMonthlyPlan =
    canViewMonthlyPlan(role);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
                <ShieldCheck className="h-4 w-4" />
                MANAGEMENT AREA
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Welcome back, {user.name.split(" ")[0]}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {isCurrentUserAdmin
                  ? "You have administrator access. You can manage users, tours, and operational data."
                  : "You have lead-guide access. You can create, edit, and manage tours."}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold capitalize text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              {role.replace("-", " ")}
            </span>
          </div>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Management tools
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Available actions depend on your role.
            </p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {canManageCurrentUserTours && (
              <Link
                to="/manage-tours"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                  <Map className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  Manage tours
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Create new tours, update existing trips, and remove tours
                  when necessary.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
                  Open tours manager
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}

            {isCurrentUserAdmin && (
              <Link
                to="/admin/users"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                  <Users className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  Manage users
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  View all registered users and manage individual user
                  accounts.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  View users
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}

            {canViewCurrentUserMonthlyPlan && (
              <Link
                to="/monthly-plan"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  <BarChart3 className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  Monthly plan
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Review the monthly tour plan and activity for a selected
                  year.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                  View monthly plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}

            {isCurrentUserAdmin && (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <CalendarDays className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  Bookings
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Booking management can be added here when your booking API
                  endpoints are ready.
                </p>

                <span className="mt-5 inline-flex text-sm font-semibold text-slate-400 dark:text-slate-500">
                  Coming soon
                </span>
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;