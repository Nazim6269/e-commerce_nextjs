"use client";

import { useEffect, useMemo, useState } from "react";
import { products } from "@wix/stores";
import { cartStorage } from "@/services/localStorage";
import OrderSummary from "./OrderSummary";
import type { CartItemMinimal } from "./Add";
import Link from "next/link";

const shippingOptions = [
  { id: "standard", label: "Standard (3-5 days)", price: 5 },
  { id: "express", label: "Express (1-2 days)", price: 15 },
  { id: "pickup", label: "Store pickup", price: 0 },
] as const;

const TAX_RATE = 0.07; // 7% demo tax

const CheckoutSection = ({ items }: { items: products.Product[] }) => {
  const [cart, setCart] = useState<CartItemMinimal[]>([]);
  const [shippingId, setShippingId] = useState<string>("standard");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = cartStorage.getProduct() || [];
    setCart(stored);

    const sync = () => setCart(cartStorage.getProduct() || []);
    window.addEventListener("cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const lines = useMemo(() => {
    return items
      .map((p) => {
        const cartItem = cart.find((c) => c.id === p._id);
        if (!cartItem) return null;
        const qty = cartItem.qty ?? 1;
        const price = p.priceData?.price ?? 0;
        return {
          id: p._id!,
          name: p.name || "",
          qty,
          price,
          lineTotal: price * qty,
        };
      })
      .filter(Boolean) as {
      id: string;
      name: string;
      qty: number;
      price: number;
      lineTotal: number;
    }[];
  }, [items, cart]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines]
  );

  const shipping = useMemo(
    () => shippingOptions.find((o) => o.id === shippingId)?.price ?? 0,
    [shippingId]
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "SAVE10") {
      return subtotal * 0.1;
    }
    if (appliedCoupon === "FREESHIP") {
      return shipping;
    }
    return 0;
  }, [appliedCoupon, subtotal, shipping]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "SAVE10" || code === "FREESHIP") {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!agree || loading) return;
    if (!guestEmail || !guestName) {
      setError("Please enter your name and email.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const shippingOption = shippingOptions.find((o) => o.id === shippingId);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lines,
          shippingAmount: shipping,
          taxAmount: tax,
          shippingLabel: shippingOption?.label,
          guest: {
            name: guestName,
            email: guestEmail,
          },
          coupon: appliedCoupon
            ? {
                code: appliedCoupon,
                amount: discount,
              }
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start checkout");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong starting payment.");
      setLoading(false);
    }
  };

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-6">
      {/* Guest checkout info */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Guest checkout details
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You can place an order without creating an account. We&apos;ll send
          the order confirmation to your email.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-nazim"
          />
          <input
            type="email"
            placeholder="Email for receipt"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-nazim"
          />
        </div>
      </div>

      {/* Shipping options */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Shipping options
        </h4>
        <div className="space-y-2">
          {shippingOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={shippingId === opt.id}
                  onChange={() => setShippingId(opt.id)}
                  className="h-4 w-4 text-nazim"
                />
                <span>{opt.label}</span>
              </div>
              <span className="font-medium">
                {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Coupon / discounts */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Coupon / discount
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-nazim"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Apply
          </button>
        </div>
        {appliedCoupon && (
          <p className="text-xs text-green-600">
            Coupon <span className="font-medium">{appliedCoupon}</span> applied.
          </p>
        )}
        {couponError && (
          <p className="text-xs text-red-500">{couponError}</p>
        )}
      </div>

      {/* Order summary before payment */}
      <OrderSummary
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        discount={discount}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Terms + actions */}
      <div className="flex items-start sm:items-center">
        <input
          id="terms-checkbox-2"
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-primary-600 focus:ring-2 focus:ring-primary-500"
        />
        <label
          htmlFor="terms-checkbox-2"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          I agree with the{" "}
          <Link
            href="#"
            className="text-primary-700 underline hover:no-underline"
          >
            Terms and Conditions
          </Link>
        </label>
      </div>

      <div className="gap-4 sm:flex sm:items-center">
        <Link
          href={"/"}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
        >
          Return to Shopping
        </Link>

        <button
          type="button"
          disabled={!agree || loading}
          onClick={handlePlaceOrder}
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 disabled:opacity-60 sm:mt-0"
        >
          {loading ? "Redirecting to payment..." : "Review & pay"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSection;

