"use client";

import { cartStorage } from "@/services/localStorage";
import { products } from "@wix/stores";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItemMinimal } from "./Add";
import CartItem from "./CartItem";

const CartList = ({ items }: { items: any }) => {
  const [cart, setCart] = useState<CartItemMinimal[]>([]);

  const filteredProducts = items.filter((wixItem: products.Product) =>
    cart.some((item) => item.id === wixItem._id)
  );

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    cartStorage.setProduct(updated);
    setCart(updated);
  };

  useEffect(() => {
    const stored = cartStorage.getProduct() || [];
    setCart(stored);
  }, []);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-nazim via-pink-400 to-pink-300 text-white shadow-xl dark:from-nazim dark:via-pink-400 dark:to-pink-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-12 w-12"
            >
              <path
                d="M7 7V6a5 5 0 0 1 10 0v1h2.25a.75.75 0 0 1 .74.86l-1.5 10.5A2.75 2.75 0 0 1 15.76 21H8.24a2.75 2.75 0 0 1-2.73-2.64L4 7.86A.75.75 0 0 1 4.75 7H7Zm1.5 0h7V6a3.5 3.5 0 0 0-7 0v1Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-nazim text-xs font-semibold text-white ring-4 ring-white dark:ring-gray-950">
            0
          </div>
        </div>

        <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-white md:text-3xl">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-gray-500 dark:text-gray-400 md:text-base">
          Looks like you haven&apos;t added anything yet. Discover our latest
          arrivals and curated picks to start building your perfect cart.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/list"
            className="inline-flex w-full items-center justify-center rounded-full bg-nazim px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-white hover:text-nazim ring-1 ring-nazim focus:outline-none focus:ring-2 focus:ring-nazim focus:ring-offset-2 dark:bg-nazim dark:text-white dark:hover:bg-transparent dark:hover:text-nazim"
          >
            Start shopping
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full ring-1 ring-nazim px-6 py-3 text-sm font-medium text-nazim transition hover:bg-nazim hover:text-white focus:outline-none focus:ring-2 focus:ring-nazim focus:ring-offset-2 dark:ring-nazim dark:text-nazim dark:hover:bg-nazim dark:hover:text-white"
          >
            View featured products
          </Link>
        </div>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
          <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-pink-900/30 dark:bg-gray-900/60">
            <p className="font-semibold">Free & fast shipping</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enjoy quick delivery on all orders over a certain amount.
            </p>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-pink-900/30 dark:bg-gray-900/60">
            <p className="font-semibold">Secure checkout</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Encrypted payments with trusted providers and full buyer
              protection.
            </p>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-pink-900/30 dark:bg-gray-900/60">
            <p className="font-semibold">Curated quality</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Handpicked products selected for style, quality, and value.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {filteredProducts.map((item: products.Product) => (
        <CartItem
          key={item._id}
          image={item.media?.mainMedia?.image?.url || "/product.png"}
          name={item?.name!}
          availability="In Stock"
          price={item?.priceData?.price!}
          initialQuantity={1}
          productId={item._id!}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
};

export default CartList;
