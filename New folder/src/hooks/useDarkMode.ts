import { useEffect, useState } from "react";

type Theme = "dark" | "light";


export function useDarkMode(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Respect a previously saved preference
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "dark" || saved === "light") return saved;

    // 2. Fall back to the OS preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement; // <html>

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Persist for next visit
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return [theme, toggleTheme];
}
