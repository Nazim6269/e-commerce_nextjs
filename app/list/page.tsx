import { Suspense } from "react";
import Skeleton from "@/components/Skeleton";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";

// Wix client depends on cookies, so keep this route dynamic
export const dynamic = "force-dynamic";

const ListPage = async ({ searchParams }: { searchParams: Promise<any> }) => {
  const resolvedSearchParams = await searchParams;
  const wixClient = await wixClientServer();
  let collectionId = "00000000-000000-000000-000000000001";
  let collectionName = "All Products";

  try {
    const res = await wixClient.collections.getCollectionBySlug(
      resolvedSearchParams.cat || "all-products"
    );
    collectionId = res.collection?._id || collectionId;
    collectionName = res.collection?.name || collectionName;
  } catch (err) {
    console.error("Collection error:", err);
  }

  // Fetch all categories for the filter component
  const categoriesRes = await wixClient.collections.queryCollections().find();
  const categories = categoriesRes.items.map(cat => ({
    name: cat.name || "",
    slug: cat.slug || ""
  }));

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-nazim text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      <Filter categories={categories} />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">{collectionName}</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList
          categoryId={collectionId}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;
