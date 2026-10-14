import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Map,
  User as UserIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import type User from "../../types/User";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Avatar from "../Avatar/Avatar";

type UserAccountMenuProps = {
  user: User;
  onLogout: () => void;
};

export function UserAccountMenu({ user, onLogout }: UserAccountMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Desktop detection: md screens (>= 768px)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isAdmin = user.role === "admin";
  const isLeadGuide = user.role === "lead-guide";
  const canOpenDashboard = isAdmin || isLeadGuide;
  const canManageTours = isAdmin || isLeadGuide;

  const firstName = user.name.trim().split(/\s+/)[0] || "User";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // When resizing to mobile, ensure dropdown is closed
  useEffect(() => {
    if (!isDesktop) {
      setIsDropdownOpen(false);
    }
  }, [isDesktop]);

  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MOBILE BEHAVIOR (< md screens): Direct Link Avatar to /profile
     The dropdown is completely disabled; clicking navigates directly.
     ────────────────────────────────────────────────────────────────────────── */
  if (!isDesktop) {
    return (
      <Link
        to="/profile"
        className="group relative flex items-center rounded-full p-0.5 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label={`View profile for ${user.name}`}
        title="View Profile"
      >
        <Avatar src={user.photo} name={user.name} size="md" />
        <span className="sr-only">Go to Profile</span>
      </Link>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     DESKTOP BEHAVIOR (>= md screens): Dropdown menu toggle
     ────────────────────────────────────────────────────────────────────────── */
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900"
        aria-label="User account menu"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
      >
        <Avatar src={user.photo} name={user.name} size="md" />

        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {firstName}
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Desktop Dropdown Popover */}
      {isDropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
        >
          {/* User Account Info Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <Avatar src={user.photo} name={user.name} size="md" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold capitalize text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                {user.role?.replace("-", " ") || "user"}
              </span>
            </div>
          </div>

          {/* User Navigation Links */}
          <div className="p-1.5">
            <NavLink
              to="/profile"
              onClick={closeDropdown}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              <UserIcon className="h-4 w-4 text-slate-400" />
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/my-bookings"
              onClick={closeDropdown}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>My Bookings</span>
            </NavLink>
          </div>

          {/* Management Area (Admin & Lead Guide) */}
          {(canOpenDashboard || canManageTours) && (
            <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
              <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Management
              </p>

              {canOpenDashboard && (
                <NavLink
                  to="/admin"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-400"
                >
                  <LayoutDashboard className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Dashboard</span>
                </NavLink>
              )}

              {canManageTours && (
                <NavLink
                  to="/manage-tours"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-400"
                >
                  <Map className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Manage Tours</span>
                </NavLink>
              )}
            </div>
          )}

          {/* Sign Out Button */}
          <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                closeDropdown();
                onLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAccountMenu;
