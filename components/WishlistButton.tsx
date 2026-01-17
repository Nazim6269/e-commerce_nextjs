"use client";

import { addToWishlist, removeFromWishlist } from "@/actions/wishlist";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

const WishlistButton = ({
    productId,
    slug,
    initialIsInWishlist = false,
}: {
    productId: string;
    slug: string;
    initialIsInWishlist?: boolean;
}) => {
    const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link

        // Optimistic update
        const previousState = isInWishlist;
        setIsInWishlist(!previousState);

        startTransition(async () => {
            try {
                if (previousState) {
                    // It was true, so we are removing
                    const res = await removeFromWishlist(productId);
                    if (!res.success) {
                        setIsInWishlist(previousState); // Revert
                        toast.error(res.message);
                    } else {
                        toast.success("Removed from wishlist");
                        router.refresh();
                    }
                } else {
                    // It was false, so we are adding
                    const res = await addToWishlist(productId, slug);
                    if (!res.success) {
                        setIsInWishlist(previousState); // Revert
                        toast.error(res.message);
                    } else {
                        toast.success("Added to wishlist");
                        router.refresh();
                    }
                }
            } catch (err) {
                setIsInWishlist(previousState);
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <button
            disabled={isPending}
            onClick={handleToggle}
            className="rounded-md bg-white p-2 hover:bg-gray-100 transition-colors shadow-sm ring-1 ring-gray-200"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-6 h-6 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
            />
        </button>
    );
};

export default WishlistButton;
