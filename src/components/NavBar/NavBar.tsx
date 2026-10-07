import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Button from "../Button/Buttons";
import Logo from "../Logo/Logo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

import { useLogout } from "../../hooks/auth/useLogout";
import type { RootState } from "../../store/store";
import type User from "../../types/User";

const IMG_BASE = "http://localhost:5020/img/users/";

type UserAvatarProps = {
  user: User;
  size?: "sm" | "md";
};

function UserAvatar({
  user,
  size = "md",
}: UserAvatarProps) {
  const sizeClassName =
    size === "sm"
      ? "h-7 w-7 text-xs"
      : "h-9 w-9 text-sm";

  const isDefaultPhoto =
    !user.photo || user.photo === "default.jpg";

  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isDefaultPhoto) {
    return (
      <span
        className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white ring-2 ring-teal-400 ring-offset-1 dark:ring-offset-slate-800`}
      >
        {initials || "U"}
      </span>
    );
  }

  return (
    <img
      src={`${IMG_BASE}${user.photo}`}
      alt={user.name}
      className={`${sizeClassName} shrink-0 rounded-full object-cover ring-2 ring-teal-400 ring-offset-1 dark:ring-offset-slate-800`}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "User";
}

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;

  const handleLogout = useLogout();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
    هذه الصلاحيات تتحكم في شكل الواجهة فقط.
    الحماية الحقيقية للـ API موجودة في الـ backend:
    protectRoute + restrictTo(...)
  */
  const isAdmin = user?.role === "admin";
  const isLeadGuide = user?.role === "lead-guide";

  const canOpenDashboard = isAdmin || isLeadGuide;
  const canManageTours = isAdmin || isLeadGuide;
  const canManageUsers = isAdmin;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function closeMenus() {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }

  function onLogout() {
    handleLogout();
    closeMenus();
  }

  function desktopLinkClassName(isActive: boolean) {
    return [
      "border-b-2 py-5 text-sm font-medium transition-colors",
      isActive
        ? "border-teal-600 font-semibold text-teal-600 dark:border-teal-400 dark:text-teal-400"
        : "border-transparent text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400",
    ].join(" ");
  }

  function dropdownLinkClassName() {
    return "flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700";
  }

  function mobileLinkClassName() {
    return "block py-3 text-sm font-medium text-slate-700 transition-colors hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo + desktop navigation */}
          <div className="flex min-w-0 items-center gap-8">
            <Logo />

            <nav
              className="hidden items-center gap-6 md:flex"
              aria-label="Primary navigation"
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  desktopLinkClassName(isActive)
                }
              >
                All Tours
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  desktopLinkClassName(isActive)
                }
              >
                Contact Us
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  desktopLinkClassName(isActive)
                }
              >
                About Us
              </NavLink>

              {user && (
                <NavLink
                  to="/bookings"
                  className={({ isActive }) =>
                    desktopLinkClassName(isActive)
                  }
                >
                  My Bookings
                </NavLink>
              )}

              {canManageTours && (
                <NavLink
                  to="/manage-tours"
                  className={({ isActive }) =>
                    desktopLinkClassName(isActive)
                  }
                >
                  Manage Tours
                </NavLink>
              )}

              {canOpenDashboard && (
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    desktopLinkClassName(isActive)
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right: Account controls */}
          <div className="flex shrink-0 items-center gap-3">
            {user ? (
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsDropdownOpen((isOpen) => !isOpen)
                  }
                  className="flex items-center gap-2.5 rounded-full px-2 py-1.5 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900"
                  aria-label="Open user menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                >
                  <UserAvatar user={user} />

                  <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
                    {firstName(user.name)}
                  </span>

                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                  >
                    {/* Account information */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                      <UserAvatar user={user} size="sm" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs font-semibold capitalize text-teal-600 dark:text-teal-400">
                          {user.role?.replace("-", " ") ?? "user"}
                        </p>
                      </div>
                    </div>

                    {/* Personal account links */}
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        onClick={closeMenus}
                        className={dropdownLinkClassName()}
                      >
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        My Profile
                      </NavLink>

                      <NavLink
                        to="/bookings"
                        onClick={closeMenus}
                        className={dropdownLinkClassName()}
                      >
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                          />
                        </svg>
                        My Bookings
                      </NavLink>
                    </div>

                    {/* Management links */}
                    {(canOpenDashboard ||
                      canManageTours ||
                      canManageUsers) && (
                      <div className="border-t border-slate-100 py-1 dark:border-slate-700">
                        <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Management
                        </p>

                        {canOpenDashboard && (
                          <NavLink
                            to="/admin"
                            onClick={closeMenus}
                            className={dropdownLinkClassName()}
                          >
                            <svg
                              className="h-4 w-4 text-teal-600 dark:text-teal-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 3v18h16.5V3H3.75zm4.5 4.5h2.25V12H8.25V7.5zm0 6h2.25v3H8.25v-3zm5.25-6h2.25V12H13.5V7.5zm0 6h2.25v3H13.5v-3z"
                              />
                            </svg>
                            Dashboard
                          </NavLink>
                        )}

                        {canManageTours && (
                          <NavLink
                            to="/manage-tours"
                            onClick={closeMenus}
                            className={dropdownLinkClassName()}
                          >
                            <svg
                              className="h-4 w-4 text-teal-600 dark:text-teal-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 6.75h18M6.75 3v3.75m10.5-3v3.75M6 10.5h12a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0118 19.5H6A1.5 1.5 0 014.5 18v-6A1.5 1.5 0 016 10.5z"
                              />
                            </svg>
                            Manage Tours
                          </NavLink>
                        )}

                        {canManageUsers && (
                          <NavLink
                            to="/admin/users"
                            onClick={closeMenus}
                            className={dropdownLinkClassName()}
                          >
                            <svg
                              className="h-4 w-4 text-violet-600 dark:text-violet-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18.75a6 6 0 00-12 0m12 0a6 6 0 011.5.75m-1.5-.75H6m12 0v.75m-12-.75v.75m6-7.5a3 3 0 100-6 3 3 0 000 6z"
                              />
                            </svg>
                            Manage Users
                          </NavLink>
                        )}
                      </div>
                    )}

                    {/* Logout */}
                    <div className="border-t border-slate-100 py-1 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Button to="/login" variant="secondary">
                  Login
                </Button>

                <Button to="/signup" variant="primary">
                  Sign up
                </Button>
              </div>
            )}

            <ThemeToggle />

            <button
              type="button"
              onClick={() =>
                setIsMenuOpen((isOpen) => !isOpen)
              }
              className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <ul className="divide-y divide-slate-100 px-4 py-2 dark:divide-slate-800">
            <li>
              <NavLink
                to="/"
                end
                onClick={closeMenus}
                className={mobileLinkClassName()}
              >
                All Tours
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={closeMenus}
                className={mobileLinkClassName()}
              >
                Contact Us
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                onClick={closeMenus}
                className={mobileLinkClassName()}
              >
                About Us
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/bookings"
                    onClick={closeMenus}
                    className={mobileLinkClassName()}
                  >
                    My Bookings
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/profile"
                    onClick={closeMenus}
                    className={mobileLinkClassName()}
                  >
                    My Profile
                  </NavLink>
                </li>

                {canOpenDashboard && (
                  <li>
                    <NavLink
                      to="/admin"
                      end
                      onClick={closeMenus}
                      className="block py-3 text-sm font-semibold text-teal-700 dark:text-teal-400"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}

                {canManageTours && (
                  <li>
                    <NavLink
                      to="/manage-tours"
                      onClick={closeMenus}
                      className="block py-3 text-sm font-semibold text-teal-700 dark:text-teal-400"
                    >
                      Manage Tours
                    </NavLink>
                  </li>
                )}

                {canManageUsers && (
                  <li>
                    <NavLink
                      to="/admin/users"
                      onClick={closeMenus}
                      className="block py-3 text-sm font-semibold text-violet-700 dark:text-violet-400"
                    >
                      Manage Users
                    </NavLink>
                  </li>
                )}

                <li>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full py-3 text-left text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    onClick={closeMenus}
                    className="block py-3 text-sm font-medium text-teal-600"
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/signup"
                    onClick={closeMenus}
                    className="block py-3 text-sm font-medium text-teal-600"
                  >
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default NavBar;