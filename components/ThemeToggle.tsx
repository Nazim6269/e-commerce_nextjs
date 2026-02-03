"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Moon size={18} />
        ) : theme === "light" ? (
          <Sun size={18} />
        ) : (
          <Monitor size={18} />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[140px]">
          <button
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              theme === "light" ? "text-nazim font-medium" : ""
            }`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              theme === "dark" ? "text-nazim font-medium" : ""
            }`}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              theme === "system" ? "text-nazim font-medium" : ""
            }`}
          >
            <Monitor size={14} /> System
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
