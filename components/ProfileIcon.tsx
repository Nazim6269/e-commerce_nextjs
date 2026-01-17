"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SettingModal from "./SettingModal";

const ProfileIcon = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="relative w-5 h-5 md:w-6 md:h-6 cursor-pointer">
        <Image
          src="/profile.png"
          alt=""
          fill
          className="object-contain"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        />
      </div>
      {isProfileOpen && <SettingModal onClick={() => setIsProfileOpen(false)} />}
    </>
  );
};

export default ProfileIcon;
