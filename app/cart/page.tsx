import CartList from "@/components/CartList";
import OrderSummary from "@/components/OrderSummary";
import { wixClientServer } from "@/lib/wixClientServer";
import Link from "next/link";

// Force dynamic rendering because wix client reads cookies for auth
export const dynamic = "force-dynamic";

const CartPage = async () => {
  const wixClient = await wixClientServer();

  const res = await wixClient.products
    .queryProducts()
    .eq("collectionIds", "00000000-000000-000000-000000000001")
    .find();

  //TODO: Calculate total price
  const calculateTotalPrice = (): number => {
    return 20000;
  };

  return (
    <section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      <div className="flex flex-col gap-8">
        {/* ITEMS */}
        <CartList items={res.items} />

        {/* Order Summary  */}
        <div className="mt-4 space-y-6">
          <OrderSummary totalPrice={calculateTotalPrice()} tax={350} />
          <div className="flex items-start sm:items-center">
            <input
              id="terms-checkbox-2"
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
            />
            <label
              htmlFor="terms-checkbox-2"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {" "}
              I agree with the{" "}
              <a
                href="#"
                title=""
                className="text-primary-700 underline hover:no-underline dark:text-primary-500"
              >
                Terms and Conditions
              </a>{" "}
            </label>
          </div>

          <div className="gap-4 sm:flex sm:items-center">
            <Link
              href={"/"}
              className="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Return to Shopping
            </Link>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-black  px-5 py-2.5 text-sm font-medium text-white  focus:outline-none focus:ring-4  sm:mt-0"
            >
              Send the order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
