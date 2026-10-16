import {
  Calendar,
  Compass,
  Heart,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  User as UserIcon,
  X,
} from "lucide-react";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";

import type User from "../../types/User";
import Avatar from "../Avatar/Avatar";
import Logo from "../Logo/Logo";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  canOpenDashboard?: boolean;
  canManageTours?: boolean;
};

export function MobileSidebar({
  isOpen,
  onClose,
  user,
  onLogout,
  canOpenDashboard = false,
  canManageTours = false,
}: MobileSidebarProps) {
  // Prevent body scrolling when sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  function linkClassName({ isActive }: { isActive: boolean }) {
    return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Backdrop blur overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-10 flex h-full h-[100dvh] w-full max-w-xs flex-col bg-white shadow-2xl transition-transform dark:bg-slate-900">
        {/* Drawer Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
          <div onClick={onClose}>
            <Logo />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Banner (if logged in) */}
        {user && (
          <div className="shrink-0 border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
            <Link
              to="/profile"
              onClick={onClose}
              className="group flex items-center gap-3.5"
            >
              <Avatar src={user.photo} name={user.name} size="lg" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 transition-colors">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-teal-100/70 px-2.5 py-0.5 text-[10px] font-bold capitalize text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                  {user.role?.replace("-", " ") || "user"}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main App Navigation */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </p>

            <nav className="space-y-1">
              <NavLink to="/" end onClick={onClose} className={linkClassName}>
                <Compass className="h-4 w-4" />
                <span>All Tours</span>
              </NavLink>

              <NavLink to="/contact" onClick={onClose} className={linkClassName}>
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </NavLink>

              <NavLink to="/about" onClick={onClose} className={linkClassName}>
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </NavLink>
            </nav>
          </div>

          {/* User Links (if logged in) */}
          {user ? (
            <div>
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                My Account
              </p>

              <nav className="space-y-1">
                <NavLink
                  to="/profile"
                  onClick={onClose}
                  className={linkClassName}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Profile</span>
                </NavLink>

                <NavLink
                  to="/my-bookings"
                  onClick={onClose}
                  className={linkClassName}
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Bookings</span>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={onClose}
                  className={linkClassName}
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>My Wishlist</span>
                </NavLink>


                {canOpenDashboard && (
                  <NavLink
                    to="/admin"
                    onClick={onClose}
                    className={linkClassName}
                  >
                    <LayoutDashboard className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}

                {canManageTours && (
                  <NavLink
                    to="/manage-tours"
                    onClick={onClose}
                    className={linkClassName}
                  >
                    <Map className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Manage Tours</span>
                  </NavLink>
                )}
              </nav>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Footer (Sign out) */}
        {user && (
          <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800 mt-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default MobileSidebar;
