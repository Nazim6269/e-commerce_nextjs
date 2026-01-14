import CartList from "@/components/CartList";
import CheckoutSection from "@/components/CheckoutSection";
import { wixClientServer } from "@/lib/wixClientServer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering because wix client reads cookies for auth
export const dynamic = "force-dynamic";

const CartPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/cart");
  }

  const wixClient = await wixClientServer();

  const res = await wixClient.products
    .queryProducts()
    .eq("collectionIds", "00000000-000000-000000-000000000001")
    .find();

  return (
    <section className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      <div className="flex flex-col gap-8">
        {/* ITEMS */}
        <CartList items={res.items} />

        {/* Checkout: guest info, shipping, coupons, order summary */}
        <CheckoutSection items={res.items} />
      </div>
    </section>
  );
};

export default CartPage;
