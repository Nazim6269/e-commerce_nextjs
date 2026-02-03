"use server";

import { auth } from "@/auth";
import { ReviewModel } from "@/models/reviewModel";
import { userModel } from "@/models/userModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

const connectDB = async () => {
    const { connectMongoDB } = await import("@/lib/mongodb");
    await connectMongoDB();
};

export const addReview = async (formData: FormData) => {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, message: "Please login to leave a review" };

        await connectDB();
        const user = await userModel.findOne({ email: session.user.email });
        if (!user) return { success: false, message: "User not found" };

        const productId = formData.get("productId") as string;
        const rating = Number(formData.get("rating"));
        const text = formData.get("text") as string;
        const images = formData.getAll("images") as string[]; // For now assuming these are URLs

        if (!productId || !rating || !text) {
            return { success: false, message: "Please fill all fields" };
        }

        await ReviewModel.create({
            productId,
            userId: user._id,
            userName: user.name || session.user.name || "Anonymous",
            userImage: user.image || session.user.image,
            rating,
            text,
            images,
        });

        revalidatePath(`/${formData.get("slug")}`);
        return { success: true, message: "Review submitted successfully!" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
};

export const getReviews = async (productId: string) => {
    try {
        await connectDB();
        const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
        console.error("Failed to fetch reviews", error);
        return [];
    }
};
