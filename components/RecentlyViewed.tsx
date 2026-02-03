"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import Image from "next/image";
import Link from "next/link";

const RecentlyViewed = () => {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/${product.slug}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="192px"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="mt-2 text-sm font-medium truncate">{product.name}</p>
            <p className="text-sm text-nazim font-semibold">
              ${product.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
