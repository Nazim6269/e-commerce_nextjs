"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cartStorage } from "@/services/localStorage";
import type { CartItemMinimal } from "./Add";

const CartIcon = () => {
  const [cart, setCart] = useState<CartItemMinimal[]>([]);

  useEffect(() => {
    const sync = () => setCart(cartStorage.getProduct() || []);
    sync();

    // Same-tab updates (custom event) + cross-tab updates (storage event)
    window.addEventListener("cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
    [cart]
  );

  return (
    <>
      <div className="relative cursor-pointer group">
        <Image src="/cart.png" alt="" width={22} height={22} />
        {itemCount > 0 && (
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-nazim rounded-full text-white text-sm flex items-center justify-center">
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
