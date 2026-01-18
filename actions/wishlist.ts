"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { WishlistModel } from "@/models/wishlistModel";
import { userModel } from "@/models/userModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

const connectDB = async () => {
    // Rely on the cached connection from lib/db or ensure mongoose is connected
    // Since lib/db returns a MongoClient for NextAuth, we might need a separate mongoose connection
    // However, usually mongoose shares the connection if we use it correctly.
    // Let's create a helper or just check readyState
    if (mongoose.connection.readyState >= 1) return;

    // We need the URI to connect mongoose if not already connected
    // Note: In Next.js with Mongoose, it's safer to ensure connection in every action
    // But inspecting lib/db.ts, it exports a MongoClient, not a mongoose connection.
    // So we need to connect mongoose separately.
    const { mongoUri } = await import("@/secret");
    if (!mongoUri) throw new Error("Mongo URI missing");
    await mongoose.connect(mongoUri);
};

export const addToWishlist = async (productId: string, slug: string) => {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, message: "Please login" };

        // We need to find the user's ID. In NextAuth with MongoDB adapter, the user ID is in the session
        // but sometimes it's under 'id' or '_id'. Let's verify how auth.ts returns the session.
        // Assuming session.user.id exists as typical in Adapter usage, but wait, the project uses a custom User model?
        // Let's rely on finding user by email if id is missing, or trust the adapter to put id in session.
        // Standard NextAuth with Adapter adds 'id' to user.

        // However, simpler is to just store email if we want, but relational integrity is better with ID. 
        // Let's use email for now if we want to be safe or fetch the user.
        // Actually, let's use the DB query to get the User ID from email to be strict.

        await connectDB();

        // Find user by email to get the strict _id
        // But we can also store the 'sub' or just the email if we prefer. 
        // The WishlistModel expects `userId`. Let's use the email or the ID if available. 
        // For consistency with typical auth, let's look up the user.

        // IMPORTANT: The `userModel` in this project might not be exactly what the Adapter uses if not configured perfectly.
        // But let's assume `session.user` has what we need or we look up by email.

        // Small optimization: If session keys are standard, use session.user.id
        // If not, lookup. Let's do a lookup to be 100% sure we have the MongoDB _id

        const user = await userModel.findOne({ email: session.user.email });
        if (!user) return { success: false, message: "User not found" };

        const userId = user.id;

        // Check if already exists
        const existing = await WishlistModel.findOne({ userId, productId });
        if (existing) {
            return { success: false, message: "Already in wishlist" };
        }

        await WishlistModel.create({
            userId,
            productId,
            slug
        });

        revalidatePath(`/product/${slug}`);
        revalidatePath("/wishlist");
        revalidatePath(`/${slug}`); // Wix usually uses [slug] route

        return { success: true, message: "Added to wishlist" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
};

export const removeFromWishlist = async (productId: string) => {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, message: "Unauthorized" };

        await connectDB();
        const user = await userModel.findOne({ email: session.user.email });
        if (!user) return { success: false, message: "User not found" };

        await WishlistModel.findOneAndDelete({ userId: user.id, productId });

        revalidatePath("/wishlist");
        // We might not know the slug here easily to revalidate the product page, 
        // but usually the UI handles optimistic updates.
        return { success: true, message: "Removed from wishlist" };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Error removing item" };
    }
}

export const getWishlist = async () => {
    try {
        const session = await auth();
        if (!session?.user?.email) return [];

        await connectDB();
        const user = await userModel.findOne({ email: session.user.email });
        if (!user) return [];

        const items = await WishlistModel.find({ userId: user.id }).sort({ createdAt: -1 });
        // Return plain objects
        return items.map((item: any) => ({
            productId: item.productId,
            slug: item.slug,
            // convert ObjectId to string if needed or just pass properties
            _id: item._id.toString(),
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error("Failed to fetch wishlist", error);
        return [];
    }
}

export const checkIsInWishlist = async (productId: string) => {
    try {
        const session = await auth();
        if (!session?.user?.email) return false;

        await connectDB();
        const user = await userModel.findOne({ email: session.user.email });
        if (!user) return false;

        const exists = await WishlistModel.exists({ userId: user.id, productId });
        return !!exists;
    } catch (err) {
        return false;
    }
}
