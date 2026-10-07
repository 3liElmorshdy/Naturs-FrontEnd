import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "../../store/store";
import type { User } from "../../types/User";
import { getAllUsers } from "../../services/adminUsers";
import { getRequestErrorMessage } from "../../utils/requestError";

const USERS_PER_PAGE = 8;

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

function getRoleClassName(role: User["role"]) {
  switch (role) {
    case "admin":
      return "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300";

    case "lead-guide":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";

    case "guide":
      return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";

    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  }
}

function formatRole(role: User["role"]) {
  return role.replace("-", " ");
}

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function AdminUsers() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canAccessPage = currentUser?.role === "admin";

  async function loadUsers(showRefreshState = false) {
    if (showRefreshState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage("");

    try {
      const { users: loadedUsers } = await getAllUsers();

      setUsers(loadedUsers);
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

    void loadUsers();
  }, [canAccessPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.role.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, users]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, safeCurrentPage]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Management
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Users
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View and manage all registered Natours users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadUsers(true)}
          disabled={isLoading || isRefreshing}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                All users
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isLoading
                  ? "Loading users..."
                  : `${filteredUsers.length} user${
                      filteredUsers.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
          </div>

          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search users</span>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, email, or role..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>
        </div>

        {errorMessage && (
          <div className="m-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Could not load users</p>

              <p className="mt-1 leading-6">{errorMessage}</p>

              <button
                type="button"
                onClick={() => void loadUsers()}
                className="mt-3 font-semibold underline underline-offset-4 transition hover:text-rose-900 dark:hover:text-rose-100"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!errorMessage && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">User</th>
                    <th className="px-5 py-3.5 font-semibold">Email</th>
                    <th className="px-5 py-3.5 font-semibold">Role</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Joined</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />

                            <div className="space-y-2">
                              <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                              <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="h-3 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                        </td>

                        <td className="px-5 py-4">
                          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                        </td>

                        <td className="px-5 py-4">
                          <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                        </td>

                        <td className="px-5 py-4">
                          <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                        </td>
                      </tr>
                    ))}

                  {!isLoading && paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        <UserRound className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />

                        <p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
                          No users found
                        </p>

                        <p className="mt-1">
                          Try searching with a different name, email, or role.
                        </p>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                                {getInitial(user.name)}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {user.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                ID: {user._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${user.email}`}
                            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300"
                          >
                            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            {user.email}
                          </a>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getRoleClassName(
                              user.role,
                            )}`}
                          >
                            {user.role === "admin" && (
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            )}

                            {formatRole(user.role)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              user.active === false
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                            ].join(" ")}
                          >
                            {user.active === false ? "Inactive" : "Active"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {!isLoading && filteredUsers.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {(safeCurrentPage - 1) * USERS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {Math.min(
                      safeCurrentPage * USERS_PER_PAGE,
                      filteredUsers.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safeCurrentPage === 1}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {safeCurrentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1),
                      )
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default AdminUsers;