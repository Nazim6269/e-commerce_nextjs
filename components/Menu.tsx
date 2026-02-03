"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer dark:invert"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black dark:bg-gray-900 text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="/" onClick={() => setOpen(false)}>Homepage</Link>
          <Link href="/list" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/" onClick={() => setOpen(false)}>Deals</Link>
          <Link href="/" onClick={() => setOpen(false)}>About</Link>
          <Link href="/" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/" onClick={() => setOpen(false)}>Logout</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>Cart(1)</Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
