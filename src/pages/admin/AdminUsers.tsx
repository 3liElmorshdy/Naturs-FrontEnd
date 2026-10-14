import { API_ORIGIN } from "../../config";
import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  UserX,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { RootState } from "../../store/store";
import type User from "../../types/User";

import {
  deleteSpecificUser,
  getAllUsers,
  getSpecificUser,
  updateSpecificUser,
} from "../../services/adminUsers";

import { getRequestErrorMessage } from "../../utils/requestError";

const USERS_PER_PAGE = 8;

const USER_IMAGES_BASE_URL = `${API_ORIGIN}/img/users/`;

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

function formatDate(date?: string, id?: string) {
  if (date) {
    const parsedDate = new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parsedDate);
    }
  }

  // Fallback: extract date from the first 8 characters (hex timestamp) of ObjectId
  if (id && id.length === 24) {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parsedDate);
    }
  }

  return "—";
}

function getJoinedDate(user?: Partial<User> | null) {
  if (!user) return "—";
  return formatDate(user.createdAt, user._id);
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: User;
  size?: "sm" | "lg";
}) {
  const avatarClassName =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : "h-10 w-10 text-sm";

  const hasPhoto =
    user.photo && user.photo !== "default.jpg";

  if (hasPhoto) {
    return (
      <img
        src={`${USER_IMAGES_BASE_URL}${user.photo}`}
        alt={user.name}
        className={`${avatarClassName} shrink-0 rounded-full object-cover`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`flex ${avatarClassName} shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300`}
    >
      {getInitial(user.name)}
    </div>
  );
}

interface RoleOption {
  role: User["role"];
  label: string;
  badgeLabel: string;
  description: string;
  icon: typeof ShieldCheck;
  badgeColor: string;
}

const ROLES_OPTIONS: RoleOption[] = [
  {
    role: "user",
    label: "User (Traveler)",
    badgeLabel: "User",
    description: "Standard traveler. Can book tours, save favorites, and write reviews.",
    icon: UserRound,
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  },
  {
    role: "guide",
    label: "Tour Guide",
    badgeLabel: "Guide",
    description: "Assigned guide. Can accompany groups on tours and assist travelers.",
    icon: MapPin,
    badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    role: "lead-guide",
    label: "Lead Guide",
    badgeLabel: "Lead Guide",
    description: "Senior guide. Responsible for leading tours and coordinating guide teams.",
    icon: Compass,
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    role: "admin",
    label: "Administrator",
    badgeLabel: "Admin",
    description: "Full management access to tours, bookings, users, and platform settings.",
    icon: ShieldCheck,
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
];

function AdminUsers() {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Details modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Edit modal state (Role and Status)
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<User["role"]>("user");
  const [editActive, setEditActive] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Tracking user currently toggling active status
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

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

  async function handleViewUser(userId: string) {
    setIsDetailsOpen(true);
    setIsDetailsLoading(true);
    setDetailsError("");
    setSelectedUser(null);

    try {
      const user = await getSpecificUser(userId);
      setSelectedUser(user);
    } catch (error) {
      setDetailsError(getRequestErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  }

  function closeUserDetails() {
    if (isDetailsLoading) {
      return;
    }

    setIsDetailsOpen(false);
    setSelectedUser(null);
    setDetailsError("");
  }

  function openEditModal(user: User) {
    setUserToEdit(user);
    setEditRole(user.role);
    setEditActive(user.active !== false);
    setEditError("");
  }

  function closeEditModal() {
    if (isUpdating) {
      return;
    }
    setUserToEdit(null);
    setEditError("");
  }

  async function handleSaveUserEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!userToEdit) return;

    const isCurrentUser = userToEdit._id === currentUser?._id;

    if (isCurrentUser && editActive === false) {
      setEditError("You cannot deactivate your own account.");
      return;
    }

    if (isCurrentUser && editRole !== "admin") {
      setEditError("You cannot demote your own admin account.");
      return;
    }

    setIsUpdating(true);
    setEditError("");

    try {
      const updated = await updateSpecificUser(userToEdit._id, {
        role: editRole,
        active: editActive,
      });

      // Update in state immediately
      setUsers((currentUsers) =>
        currentUsers.map((u) =>
          u._id === userToEdit._id
            ? {
                ...u,
                role: updated.role ?? editRole,
                active: updated.active ?? editActive,
              }
            : u,
        ),
      );

      // Update in selectedUser if open
      if (selectedUser?._id === userToEdit._id) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                role: updated.role ?? editRole,
                active: updated.active ?? editActive,
              }
            : null,
        );
      }

      toast.success(
        `Updated "${userToEdit.name}": ${formatRole(editRole)} • ${
          editActive ? "Active" : "Inactive"
        }`,
      );

      setUserToEdit(null);
    } catch (error) {
      setEditError(getRequestErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleToggleStatus(user: User) {
    if (user._id === currentUser?._id) {
      toast.error("You cannot deactivate your own account.");
      return;
    }

    const nextActive = user.active === false ? true : false;
    setTogglingUserId(user._id);

    try {
      const updated = await updateSpecificUser(user._id, {
        active: nextActive,
      });

      setUsers((currentUsers) =>
        currentUsers.map((u) =>
          u._id === user._id
            ? { ...u, active: updated.active ?? nextActive }
            : u,
        ),
      );

      if (selectedUser?._id === user._id) {
        setSelectedUser((prev) =>
          prev ? { ...prev, active: updated.active ?? nextActive } : null,
        );
      }

      toast.success(
        nextActive
          ? `User "${user.name}" has been activated.`
          : `User "${user.name}" has been deactivated.`,
      );
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    } finally {
      setTogglingUserId(null);
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) {
      return;
    }

    if (userToDelete._id === currentUser?._id) {
      setDeleteError("You cannot delete your own account here.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteSpecificUser(userToDelete._id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userToDelete._id,
        ),
      );

      toast.success(`User "${userToDelete.name}" deleted permanently.`);
      setUserToDelete(null);
    } catch (error) {
      setDeleteError(getRequestErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  function closeDeleteConfirmation() {
    if (isDeleting) {
      return;
    }

    setUserToDelete(null);
    setDeleteError("");
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
      const roleText = formatRole(user.role).toLowerCase();
      const statusText = user.active === false ? "inactive" : "active";
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.role.toLowerCase().includes(normalizedQuery) ||
        roleText.includes(normalizedQuery) ||
        statusText.includes(normalizedQuery)
      );
    });
  }, [searchQuery, users]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(
      startIndex,
      startIndex + USERS_PER_PAGE,
    );
  }, [filteredUsers, safeCurrentPage]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      {/* Page header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Users
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View, promote roles, and manage activation status for all registered Natours users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadUsers(true)}
          disabled={isLoading || isRefreshing}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Users table card */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                All users
              </h2>

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
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search name, email, or role..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>
        </div>

        {/* Loading error */}
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
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">
                      User
                    </th>
                    <th className="px-5 py-3.5 font-semibold">
                      Email
                    </th>
                    <th className="px-5 py-3.5 font-semibold">
                      Role
                    </th>
                    <th className="px-5 py-3.5 font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-3.5 font-semibold">
                      Joined
                    </th>
                    <th className="px-5 py-3.5 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {/* Loading skeleton */}
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

                        <td className="px-5 py-4">
                          <div className="ml-auto h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                        </td>
                      </tr>
                    ))}

                  {/* No search results */}
                  {!isLoading && paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
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

                  {/* Users rows */}
                  {!isLoading &&
                    paginatedUsers.map((user) => {
                      const isCurrentUser =
                        user._id === currentUser._id;
                      const isUserInactive = user.active === false;
                      const isThisToggling = togglingUserId === user._id;

                      return (
                        <tr
                          key={user._id}
                          className="transition hover:bg-slate-50 dark:hover:bg-slate-900/50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} />

                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    {user.name}
                                  </p>
                                  {isCurrentUser && (
                                    <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                                      You
                                    </span>
                                  )}
                                </div>

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

                          {/* Role Column with interactive click to edit */}
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              className="group inline-flex items-center gap-1 text-left transition hover:scale-105"
                              title="Click to change role"
                            >
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition ${getRoleClassName(
                                  user.role,
                                )}`}
                              >
                                {user.role === "admin" && (
                                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                )}
                                {user.role === "lead-guide" && (
                                  <Compass className="mr-1 h-3.5 w-3.5" />
                                )}
                                {user.role === "guide" && (
                                  <MapPin className="mr-1 h-3.5 w-3.5" />
                                )}
                                {user.role === "user" && (
                                  <UserRound className="mr-1 h-3.5 w-3.5" />
                                )}

                                {formatRole(user.role)}

                                <Pencil className="ml-1 h-2.5 w-2.5 opacity-0 transition group-hover:opacity-100" />
                              </span>
                            </button>
                          </td>

                          {/* Status Column with interactive toggle */}
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => void handleToggleStatus(user)}
                              disabled={isCurrentUser || isThisToggling}
                              className="group inline-flex items-center gap-1.5 text-left transition disabled:cursor-not-allowed"
                              title={
                                isCurrentUser
                                  ? "Your current account is active"
                                  : isUserInactive
                                  ? "Account is inactive (Click to activate)"
                                  : "Account is active (Click to deactivate)"
                              }
                            >
                              <span
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition group-hover:opacity-85",
                                  isUserInactive
                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                                ].join(" ")}
                              >
                                {isThisToggling ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <span
                                    className={[
                                      "h-1.5 w-1.5 rounded-full",
                                      isUserInactive
                                        ? "bg-rose-500"
                                        : "bg-emerald-500 animate-pulse",
                                    ].join(" ")}
                                  />
                                )}
                                {isUserInactive ? "Inactive" : "Active"}
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {getJoinedDate(user)}
                          </td>

                          {/* Actions Column */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1. View User */}
                              <button
                                type="button"
                                onClick={() =>
                                  void handleViewUser(user._id)
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:bg-teal-500/10 dark:hover:text-teal-300"
                                title="View details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
                              </button>

                              {/* 2. Edit Role & Status */}
                              <button
                                type="button"
                                onClick={() => openEditModal(user)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:bg-teal-500/10 dark:hover:text-teal-300"
                                title="Edit role and status"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>

                              {/* 3. Quick Toggle Active/Inactive */}
                              <button
                                type="button"
                                onClick={() => void handleToggleStatus(user)}
                                disabled={isCurrentUser || isThisToggling}
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                                  isUserInactive
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                                    : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20",
                                ].join(" ")}
                                title={
                                  isCurrentUser
                                    ? "You cannot deactivate your own account"
                                    : isUserInactive
                                    ? "Activate user account"
                                    : "Deactivate user account"
                                }
                              >
                                {isThisToggling ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isUserInactive ? (
                                  <UserCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <UserX className="h-3.5 w-3.5" />
                                )}
                                <span>{isUserInactive ? "Activate" : "Deactivate"}</span>
                              </button>

                              {/* 4. Permanent Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteError("");
                                  setUserToDelete(user);
                                }}
                                disabled={isCurrentUser}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                                title={
                                  isCurrentUser
                                    ? "You cannot delete your own account here"
                                    : "Delete user permanently"
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                    disabled={safeCurrentPage === 1}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-teal-50 px-2 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                      {safeCurrentPage}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="px-1 text-slate-500 dark:text-slate-400">
                      {totalPages}
                    </span>
                  </div>

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

      {/* Edit Role & Status Modal */}
      {userToEdit && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
        >
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <UserAvatar user={userToEdit} size="lg" />
                <div>
                  <h2
                    id="edit-user-title"
                    className="text-lg font-bold text-slate-900 dark:text-white"
                  >
                    Edit User
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {userToEdit.name} • {userToEdit.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Self-edit warning banner */}
            {userToEdit._id === currentUser?._id && (
              <div
                role="alert"
                className="mt-4 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
              >
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  You are editing your own admin account. Role demotion and deactivation are locked to prevent accidental lockout.
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveUserEdit} className="mt-5 space-y-6">
              {/* Section 1: Role Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white">
                  User Role (الصلاحية)
                </label>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Select the level of access and permissions for this account.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ROLES_OPTIONS.map((item) => {
                    const isSelected = editRole === item.role;
                    const Icon = item.icon;
                    const isSelfAdmin =
                      userToEdit._id === currentUser?._id && item.role !== "admin";

                    return (
                      <button
                        key={item.role}
                        type="button"
                        disabled={isSelfAdmin}
                        onClick={() => setEditRole(item.role)}
                        className={[
                          "relative flex flex-col items-start rounded-xl border p-3.5 text-left transition",
                          isSelected
                            ? "border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 dark:border-teal-500 dark:bg-teal-500/10"
                            : "border-slate-200 hover:border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600",
                          isSelfAdmin ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                        ].join(" ")}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.badgeColor}`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {item.badgeLabel}
                            </span>
                          </div>

                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Account Status Toggle (Active / Inactive) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white">
                      Account Status (حالة الحساب)
                    </label>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {editActive
                        ? "Active — The user can log in, book tours, and access account features."
                        : "Inactive — Account is disabled. The user will be blocked from logging in."}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editActive}
                    disabled={userToEdit._id === currentUser?._id}
                    onClick={() => setEditActive(!editActive)}
                    className={[
                      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-40",
                      editActive
                        ? "bg-teal-600 dark:bg-teal-500"
                        : "bg-slate-300 dark:bg-slate-600",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                        editActive ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold",
                      editActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        editActive ? "bg-emerald-500" : "bg-rose-500",
                      ].join(" ")}
                    />
                    {editActive ? "Currently: Active" : "Currently: Inactive (Suspended)"}
                  </span>
                </div>
              </div>

              {/* Error message */}
              {editError && (
                <div
                  role="alert"
                  className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating && (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  )}
                  <span>{isUpdating ? "Saving changes..." : "Save changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User details modal */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-details-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  User details
                </p>

                <h2
                  id="user-details-title"
                  className="mt-1 text-xl font-bold text-slate-900 dark:text-white"
                >
                  Account overview
                </h2>
              </div>

              <button
                type="button"
                onClick={closeUserDetails}
                disabled={isDetailsLoading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Close user details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isDetailsLoading && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
                  </div>
                </div>

                <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
              </div>
            )}

            {detailsError && (
              <div
                role="alert"
                className="mt-5 flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{detailsError}</span>
              </div>
            )}

            {!isDetailsLoading && selectedUser && (
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <UserAvatar user={selectedUser} size="lg" />

                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-slate-900 dark:text-white">
                      {selectedUser.name}
                    </p>

                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                      Role
                    </dt>

                    <dd>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getRoleClassName(
                          selectedUser.role,
                        )}`}
                      >
                        {formatRole(selectedUser.role)}
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                      Status
                    </dt>

                    <dd>
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          selectedUser.active === false
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            selectedUser.active === false
                              ? "bg-rose-500"
                              : "bg-emerald-500 animate-pulse",
                          ].join(" ")}
                        />
                        {selectedUser.active === false
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                      User ID
                    </dt>

                    <dd className="max-w-[220px] truncate font-mono text-xs text-slate-700 dark:text-slate-200">
                      {selectedUser._id}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                      Joined
                    </dt>

                    <dd className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {getJoinedDate(selectedUser)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              {!isDetailsLoading && selectedUser && (
                <button
                  type="button"
                  onClick={() => {
                    closeUserDetails();
                    openEditModal(selectedUser);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/25"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Role & Status
                </button>
              )}

              <button
                type="button"
                onClick={closeUserDetails}
                disabled={isDetailsLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                  <Trash2 className="h-5 w-5" />
                </div>

                <h2
                  id="delete-user-title"
                  className="mt-4 text-lg font-bold text-slate-900 dark:text-white"
                >
                  Delete user?
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Close delete confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              You are about to permanently delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {userToDelete.name}
              </span>
              .
            </p>

            <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
              {userToDelete.email}
            </p>

            <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              This action cannot be undone. If you only want to temporarily disable this user, use the <strong className="font-semibold">Deactivate</strong> button instead.
            </p>

            {deleteError && (
              <div
                role="alert"
                className="mt-4 flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDeleteUser()}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}

                {isDeleting
                  ? "Deleting..."
                  : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminUsers;
