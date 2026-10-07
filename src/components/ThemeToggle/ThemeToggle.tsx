import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

/**
 * ThemeToggle
 *
 * A polished icon button for a NavBar that switches between dark and light mode.
 * - Shows a Sun icon  when the current theme is "dark"  (click ? go light)
 * - Shows a Moon icon when the current theme is "light" (click ? go dark)
 */
export default function ThemeToggle() {
  const [theme, toggleTheme] = useDarkMode();
  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        // Base shape & spacing
        "relative flex h-9 w-9 items-center justify-center rounded-full",
        "transition-all duration-300 ease-in-out",
        // Light-mode pill
        "bg-slate-100 text-slate-600",
        "hover:bg-amber-100 hover:text-amber-500",
        // Dark-mode pill
        "dark:bg-slate-800 dark:text-slate-400",
        "dark:hover:bg-indigo-900/60 dark:hover:text-indigo-300",
        // Focus ring for a11y
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-teal-500 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
      ].join(" ")}
    >
      {/* Icon swap with smooth scale + rotate animation */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <Sun size={18} strokeWidth={2} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <Moon size={18} strokeWidth={2} />
      </span>
    </button>
  );
}
