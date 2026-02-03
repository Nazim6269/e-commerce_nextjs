"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LanguageSwitcher = () => {
  const router = useRouter();
  const [locale, setLocale] = useState("en");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    if (cookieLocale) setLocale(cookieLocale);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    setLocale(newLocale);
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm"
        aria-label="Switch language"
      >
        <Languages size={18} />
        <span className="hidden xl:inline text-xs uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[120px]">
          <button
            onClick={() => switchLocale("en")}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              locale === "en" ? "text-nazim font-medium" : ""
            }`}
          >
            EN English
          </button>
          <button
            onClick={() => switchLocale("bn")}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              locale === "bn" ? "text-nazim font-medium" : ""
            }`}
          >
            BN বাংলা
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
