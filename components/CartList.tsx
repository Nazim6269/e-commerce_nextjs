"use client";

import { cartStorage } from "@/services/localStorage";
import { products } from "@wix/stores";
import { useEffect, useState } from "react";
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

  if (filteredProducts.length === 0)
    return <div className="text-gray-500 dark:text-gray-400">No cart items. Please add products.</div>;

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
