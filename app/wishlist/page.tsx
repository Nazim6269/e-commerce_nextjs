
import { getWishlist } from "@/actions/wishlist";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import DOMPurify from "isomorphic-dompurify";
import { auth } from "@/auth";

const WishlistPage = async () => {
    const wishlistItems = await getWishlist();
    const session = await auth();

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-semibold">Your Wishlist</h1>
                <p className="text-gray-500">Your wishlist is empty.</p>
                <Link href="/" className="bg-nazim text-white px-4 py-2 rounded-md ring-1 ring-nazim hover:bg-white hover:text-nazim transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const productIds = wishlistItems.map((item) => item.productId);

    const wixClient = await wixClientServer();
    const res = await wixClient.products
        .queryProducts()
        .in("_id", productIds)
        .find();

    const products = res.items;

    return (
        <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <h1 className="text-2xl font-semibold mb-8">Your Wishlist</h1>
            <div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
                {products.map((product) => (
                    <Link
                        href={`/${product.slug}`}
                        className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
                        key={product._id}
                    >
                        <div className="relative w-full h-80">
                            <Image
                                src={product.media?.mainMedia?.image?.url || "/product.png"}
                                alt={product.name || ""}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 22vw"
                                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                            />
                            {product.media?.items && product.media.items.length > 1 && (
                                <Image
                                    src={product.media.items[1]?.image?.url || "/product.png"}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 22vw"
                                    className="absolute object-cover rounded-md"
                                />
                            )}
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">{product.name}</span>
                                <span className="font-semibold text-sm text-gray-700">
                                    ${product.priceData?.price?.toFixed(2)}
                                </span>
                            </div>
                            {/* Force button to prevent navigation when clicking interaction */}
                            {/* Force button to prevent navigation when clicking interaction */}
                            <div>
                                {product._id && <WishlistButton productId={product._id} slug={product.slug || ""} userId={session?.user?.id} initialIsInWishlist={true} />}
                            </div>
                        </div>

                        {product.additionalInfoSections && (
                            <div
                                className="text-sm text-gray-500 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        product.additionalInfoSections.find(
                                            (section: any) => section.title === "shortDesc"
                                        )?.description || ""
                                    ),
                                }}
                            ></div>
                        )}

                        <button className="rounded-2xl ring-1 ring-nazim text-nazim w-max py-2 px-4 text-xs hover:bg-nazim hover:text-white">
                            Add to Cart
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
