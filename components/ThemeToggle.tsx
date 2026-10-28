"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
    try {
      localStorage.setItem("sunara-theme", next);
    } catch {}
    setTheme(next);
  };

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === null ? undefined : isDark}
    >
      <Sun className="theme-icon theme-icon-sun" size={18} aria-hidden="true" />
      <Moon className="theme-icon theme-icon-moon" size={18} aria-hidden="true" />
    </button>
  );
}
