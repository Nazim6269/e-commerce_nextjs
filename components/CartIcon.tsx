"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cartStorage } from "@/services/localStorage";
import type { CartItemMinimal } from "./Add";

const CartIcon = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [cart, setCart] = useState<CartItemMinimal[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      // If user is not logged in, ignore any localStorage cart
      setCart([]);
      return;
    }

    const sync = () => setCart(cartStorage.getProduct() || []);
    sync();

    // Same-tab updates (custom event) + cross-tab updates (storage event)
    window.addEventListener("cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [isLoggedIn]);

  // Show number of different items (distinct products) in cart, not total quantity
  const itemCount = useMemo(
    () => (isLoggedIn ? cart.length : 0),
    [cart.length, isLoggedIn]
  );

  return (
    <>
      <div className="relative cursor-pointer group flex items-center">
        <div className="relative w-5 h-5 md:w-6 md:h-6">
          <Image src="/cart.png" alt="" fill className="object-contain dark:invert" />
        </div>
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 w-4 h-4 md:w-5 md:h-5 bg-nazim rounded-full text-white text-[10px] md:text-xs flex items-center justify-center font-medium">
            {itemCount}
          </div>
        )}

        {/* Tooltip */}
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition absolute top-8 right-0 z-50">
          <div className="bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
            {itemCount === 0 ? "Cart is empty" : `${itemCount} item(s) in cart`}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartIcon;
