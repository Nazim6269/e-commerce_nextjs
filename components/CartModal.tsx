import CartItem from "./CartItem";

const CartModal = () => {
  const cartItems = true;
  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white dark:bg-gray-900 dark:border dark:border-gray-700 top-12 right-0 flex flex-col gap-6 z-20">
      {!cartItems ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          <CartItem
            image="https://images.pexels.com/photos/20218545/pexels-photo-20218545.jpeg"
            name="Delicious Pancakes"
            availability="In Stock"
            price={12.99}
            initialQuantity={2}
          />
        </>
      )}
    </div>
  );
};

export default CartModal;
