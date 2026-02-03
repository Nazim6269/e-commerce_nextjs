import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";

// Define the structure for the query parameters
interface SearchParams {
  sort?: string;
  min?: string;
  max?: string;
  type?: string;
  name?: string;
}

// Define the component's props
interface ProductListProps {
  categoryId: string;
  limit?: number;
  searchParams?: SearchParams;
}

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: ProductListProps) => {
  let res;
  try {
    const wixClient = await wixClientServer();

    // Base Product Query
    res = await wixClient.products
      .queryProducts()
      .eq("collectionIds", categoryId)
      .limit(limit || 20)
      .find();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return (
      <div className="mt-12 text-center text-gray-500">
        <p>Unable to load products. Please try again later.</p>
      </div>
    );
  }

  //copy of the original items
  let productsToFilter: products.Product[] = res.items || [];

  // --- Filtering Logic ---

  // Handle PRICE filtering (min and max)
  const minPrice = parseFloat(searchParams?.min || "0");
  const maxPrice = parseFloat(searchParams?.max || Infinity.toString());

  if (minPrice > 0 || maxPrice < Infinity) {
    productsToFilter = productsToFilter.filter((product) => {
      const price = product.priceData?.price ?? 0;
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Handle TYPE filtering (physical vs. digital)
  if (searchParams?.type) {
    productsToFilter = productsToFilter.filter((product) => {
      if (
        searchParams.type === "physical" &&
        product.productType === "physical"
      ) {
        return true;
      }
      if (
        searchParams.type === "digital" &&
        product.productType === "digital"
      ) {
        return true;
      }
      return false;
    });
  }

  // Handle NAME search (from search bar)
  if (searchParams?.name) {
    const term = searchParams.name.toLowerCase();
    productsToFilter = productsToFilter.filter((product) =>
      product.name?.toLowerCase().includes(term)
    );
  }

  // ---  Sorting Logic ---
  let sortedProducts = [...productsToFilter]; // Always work on a new copy

  if (searchParams?.sort) {
    const [order, type] = searchParams.sort.split("-");

    if (type === "price") {
      sortedProducts = sortedProducts.sort((a, b) => {
        const priceA = a.priceData?.price ?? 0;
        const priceB = b.priceData?.price ?? 0;
        return order === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    if (type === "lastUpdated") {
      sortedProducts = sortedProducts.sort((a, b) => {
        const dateA = new Date(a._createdDate || 0).getTime();
        const dateB = new Date(b._createdDate || 0).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
  }

  // The final list to render is the sorted list
  const finalProductList = sortedProducts;

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {finalProductList.length === 0 ? (
        <p className="text-gray-500 text-lg w-full text-center">
          No items found matching your search.
        </p>
      ) : (
        finalProductList.map((product: products.Product) => (
          <Link
            href={`/${product?.slug}`}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
            key={product?._id}
          >
            <div className="relative w-full h-80">
              {/* Main Image */}
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt={product?.name || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 22vw"
                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
              />
              {/* Secondary/Hover Image */}
              {product.media?.items && product.media.items.length > 1 && (
                <Image
                  src={product.media.items[1]?.image?.url || "/product.png"}
                  alt={`${product?.name} hover image`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 22vw"
                  className="absolute object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{product?.name}</span>
              <span className="font-semibold">
                ${product?.priceData?.price?.toFixed(2) ?? "N/A"}
              </span>
            </div>

            {/* Description Display */}
            {product.additionalInfoSections && (
              <div
                className="text-sm text-gray-500 line-clamp-2" // Added line-clamp for neatness
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
        ))
      )}
    </div>
  );
};

export default ProductList;
