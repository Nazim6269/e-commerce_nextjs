"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface CartItemProps {
  image: string;
  name: string;
  availability: string;
  price: number;
  initialQuantity?: number;
  productId?: string;
  onRemove?: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  image,
  name,
  availability,
  price,
  productId,
  onRemove,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex items-center gap-6 w-full py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition px-2">
      {/* IMAGE */}
      <Link href={"/cart"}>
        <div className="w-16 h-16 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="rounded-md object-cover"
          />
        </div>
      </Link>

      {/* PRODUCT NAME */}
      <div className="flex-1 font-medium text-gray-800 dark:text-gray-100">{name}</div>

      {/* AVAILABILITY */}
      <div className="w-28 text-sm text-green-500">{availability}</div>

      {/* QUANTITY SELECTOR */}
      <div className="flex items-center gap-2 w-28">
        <button
          onClick={decreaseQty}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          -
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          onClick={increaseQty}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          +
        </button>
      </div>

      {/* PRICE */}
      <div className="w-24 text-right font-semibold text-gray-800 dark:text-gray-100">
        ${(price * quantity).toFixed(2)}
      </div>

      {/* REMOVE BUTTON */}
      <button
        onClick={() => onRemove?.(productId!)}
        className="text-red-500 hover:text-red-600 text-sm ml-4"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
