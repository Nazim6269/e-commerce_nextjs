"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface QuickViewProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    description?: string;
    image: string;
  };
  onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 p-6 pt-0">
          <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-2xl font-bold text-nazim">
              ${product.price.toFixed(2)}
            </p>
            {product.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-4">
                {product.description}
              </p>
            )}
            <div className="flex gap-3 mt-auto">
              <Link
                href={`/${product.slug}`}
                className="flex-1 text-center py-2 px-4 bg-nazim text-white rounded-full hover:bg-pink-600 transition-colors text-sm font-medium"
                onClick={onClose}
              >
                View Details
              </Link>
              <button className="flex-1 py-2 px-4 border border-nazim text-nazim rounded-full hover:bg-nazim hover:text-white transition-colors text-sm font-medium">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
