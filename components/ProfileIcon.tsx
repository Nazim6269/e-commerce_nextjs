"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import SettingModal from "./SettingModal";

const ProfileIcon = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative w-5 h-5 md:w-6 md:h-6 cursor-pointer">
        <Image
          src="/profile.png"
          alt=""
          fill
          className="object-contain dark:invert"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        />
      </div>
      {isProfileOpen && <SettingModal onClick={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default ProfileIcon;
