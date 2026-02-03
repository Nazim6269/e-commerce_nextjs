"use client";

import { cartStorage } from "@/services/localStorage";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export interface CartItemMinimal {
  id: string;
  qty: number;
}

const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async (id: string) => {
    // Only logged-in users can add to cart
    const session = await getSession();
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(pathname || "/");
      router.push(`/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    const items: CartItemMinimal[] = cartStorage.getProduct() || [];

    let itemExists = false;

    const updatedItems = items.reduce(
      (acc: CartItemMinimal[], curr: CartItemMinimal) => {
        if (curr.id === id) {
          itemExists = true;
          acc.push({ ...curr, qty: curr.qty! + quantity });
        } else {
          acc.push(curr);
        }
        return acc;
      },
      []
    );

    if (!itemExists) {
      updatedItems.push({ id, qty: quantity });
    }

    cartStorage.setProduct(updatedItems);
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left!
              <br /> {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          onClick={() => handleAddToCart(productId)}
          className="w-36 text-sm rounded-3xl ring-1 ring-nazim text-nazim py-2 px-4 hover:bg-nazim hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
