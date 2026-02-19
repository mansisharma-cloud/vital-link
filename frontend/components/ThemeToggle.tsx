"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const root = window.document.documentElement;
    const initialTheme = savedTheme || (root.classList.contains("dark") ? "dark" : "light");

    // Use microtask to avoid "setState synchronously in effect" warning
    queueMicrotask(() => {
      setTheme(initialTheme);
      if (initialTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    });
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const root = window.document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Prevent hydration mismatch by not rendering toggle until theme is loaded
  if (!theme) return <div className="p-2 w-9 h-9" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
