import { Heart, Menu } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Button from "../Button/Buttons";
import Logo from "../Logo/Logo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import UserAccountMenu from "./UserAccountMenu";
import MobileSidebar from "./MobileSidebar";
import InstallButton from "./InstallButton";

import { useLogout } from "../../hooks/auth/useLogout";
import type { RootState } from "../../store/store";
import type User from "../../types/User";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;

  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.itemIds.length,
  );

  const handleLogout = useLogout();

  const isAdmin = user?.role === "admin";
  const isLeadGuide = user?.role === "lead-guide";
  const canOpenDashboard = isAdmin || isLeadGuide;
  const canManageTours = isAdmin || isLeadGuide;

  function desktopLinkClassName({ isActive }: { isActive: boolean }) {
    return [
      "border-b-2 py-2 text-sm font-semibold transition-colors",
      isActive
        ? "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400"
        : "border-transparent text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:gap-6">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex min-w-0 items-center gap-4 xl:gap-8">
            <Logo />

            <nav
              className="hidden items-center gap-6 xl:gap-10 lg:flex"
              aria-label="Primary navigation"
            >
              <NavLink to="/" end className={desktopLinkClassName}>
                All Tours
              </NavLink>

              <NavLink to="/contact" className={desktopLinkClassName}>
                Contact Us
              </NavLink>

              <NavLink to="/about" className={desktopLinkClassName}>
                About Us
              </NavLink>

              {user && (
                <NavLink to="/my-bookings" className={desktopLinkClassName}>
                  My Bookings
                </NavLink>
              )}

              {canOpenDashboard && (
                <NavLink to="/admin" end className={desktopLinkClassName}>
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right: User Actions Area (Install, Wishlist, Account / Auth, Theme, Mobile Hamburger) */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Wishlist Icon Button with Badge */}
            {user && (
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `relative flex items-center justify-center rounded-xl p-2 transition ${
                    isActive
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                  }`
                }
                title="My Wishlist"
                aria-label="My Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 min-w-5 translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold leading-none text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* PWA Install Button (Strategically placed next to auth buttons / profile menu) */}
            <InstallButton />

            {/* User Account Menu (Direct Link on Mobile/Tablet, Dropdown on Desktop) */}
            {user ? (
              <UserAccountMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="hidden items-center gap-2.5 sm:gap-3 lg:flex">
                <Button to="/login" variant="secondary">
                  Login
                </Button>

                <Button to="/signup" variant="primary">
                  Sign up
                </Button>
              </div>
            )}

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Mobile / Tablet Hamburger Button (Drawer trigger) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Open mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Reusable Mobile Sidebar (Drawer) ───────────────────── */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        canOpenDashboard={canOpenDashboard}
        canManageTours={canManageTours}
      />
    </header>
  );
}

export default NavBar;