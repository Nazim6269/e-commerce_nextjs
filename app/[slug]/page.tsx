import { notFound } from "next/navigation";
import { checkIsInWishlist } from "@/actions/wishlist";
import Add from "@/components/Add";
import WishlistButton from "@/components/WishlistButton";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { wixClientServer } from "@/lib/wixClientServer";

// Dynamic rendering required since wix client reads cookies for auth tokens
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleItemPage({ params }: PageProps) {
  const wixClient = await wixClientServer();
  const slug = (await params).slug;
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", slug)
    .find();

  const product = products.items[0];

  if (!product) {
    return notFound();
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* image */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product?.media?.items} />
      </div>
      {/* Texts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product?.name}</h1>
        <p className="text-gray-500">{product?.description}</p>
        <div className="h-[2px] bg-gray-100" />
        {product?.priceData?.price === product?.priceData?.discountedPrice ? (
          <h2 className="font-medium text-2xl">${product?.priceData?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product?.priceData?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${product?.priceData?.discountedPrice}
            </h2>
          </div>
        )}

        <div className="flex items-center gap-4">
          {product?._id && <WishlistButton productId={product._id} slug={product.slug || ""} initialIsInWishlist={await checkIsInWishlist(product._id)} />}
        </div>

        <div className="h-[2px] bg-gray-100" />
        {product?._id && product?.variants && product?.productOptions ? (
          <CustomizeProducts
            productId={product?._id}
            variants={product?.variants}
            productOptions={product?.productOptions}
          />
        ) : (
          <Add
            productId={product?._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product?.stock?.quantity || 0}
          />
        )}

        <div className="h-[2px] bg-gray-100" />

        {product?.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section?.title}>
            <h4 className="font-medium mb-4">{section?.title}</h4>
            <p className="text-gray-500">{section?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
