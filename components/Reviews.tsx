"use client";

import { useState, useTransition } from "react";
import { Star, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { addReview } from "@/actions/review";
import { toast } from "react-hot-toast";

interface Review {
    _id: string;
    userName: string;
    userImage?: string;
    rating: number;
    text: string;
    images: string[];
    createdAt: string;
}

const Reviews = ({ productId, slug, reviews: initialReviews }: { productId: string; slug: string; reviews: Review[] }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedImages((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a rating");
        if (!text.trim()) return toast.error("Please add a review text");

        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("slug", slug);
        formData.append("rating", rating.toString());
        formData.append("text", text);
        selectedImages.forEach((img) => formData.append("images", img));

        startTransition(async () => {
            const result = await addReview(formData);
            if (result.success) {
                toast.success(result.message);
                // Clear form
                setRating(0);
                setText("");
                setSelectedImages([]);
                // Optimistically update or just rely on revalidate
                // For a better UX, we could fetch reviews again or just add locally
                const newReview: Review = {
                    _id: Date.now().toString(),
                    userName: "You",
                    rating,
                    text,
                    images: selectedImages,
                    createdAt: new Date().toISOString(),
                };
                setReviews([newReview, ...reviews]);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="mt-12 flex flex-col gap-8">
            <h2 className="text-2xl font-semibold">Customer Reviews</h2>

            {/* Write a Review */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-medium mb-4">Write a review</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={24}
                                    className={`${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                            {rating > 0 ? `${rating} out of 5` : "Select a rating"}
                        </span>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] bg-white"
                        required
                    />

                    {/* Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            <Upload size={18} />
                            <span>Add Images</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        {selectedImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedImages.map((img, index) => (
                                    <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                                        <Image src={img} alt="review" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-max px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                    >
                        {isPending && <Loader2 size={18} className="animate-spin" />}
                        Submit Review
                    </button>
                </form>
            </div>

            {/* Review List */}
            <div className="flex flex-col gap-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    {review.userImage ? (
                                        <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{review.userName}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={`${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.text}</p>

                            {review.images && review.images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {review.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <Image src={img} alt="Review image" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
