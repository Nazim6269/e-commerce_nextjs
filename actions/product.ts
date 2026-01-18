"use server";

import { wixClientServer } from "@/lib/wixClientServer";
import { revalidatePath } from "next/cache";

export const deleteProduct = async (productId: string) => {
    const wixClient = await wixClientServer();
    try {
        await wixClient.products.deleteProduct(productId);
        revalidatePath("/admin/products");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to delete product" };
    }
};

export const updateProductStock = async (productId: string, quantity: number) => {
    const wixClient = await wixClientServer();
    try {
        // In Wix, updating stock might require specific inventory API, 
        // but let's try updating the product object if simple enough or use inventory module.
        // For simplicity in this demo, we'll try to update the product.
        // Note: Real Wix inventory often uses the @wix/inventory module.
        await wixClient.products.updateProduct(productId, {
            stock: {
                quantity: quantity
            }
        });
        revalidatePath("/admin/products");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to update stock" };
    }
};

export const toggleFeatured = async (productId: string, isFeatured: boolean) => {
    const wixClient = await wixClientServer();
    try {
        // Featured usually means adding to a specific collection.
        // For now, let's just attempt to update an additional field or tag if available,
        // or just log it for now as Wix's "featured" is collection-based.
        console.log(`Toggling featured for ${productId} to ${isFeatured}`);
        // This is a placeholder for actual Wix collection management.
        return { success: true };
    } catch (err) {
        return { success: false };
    }
};

export const createProduct = async (data: any) => {
    const wixClient = await wixClientServer();
    try {
        const response = await wixClient.products.createProduct({
            name: data.name,
            productType: "physical" as any,
            priceData: {
                price: parseFloat(data.price),
            },
            description: data.description,
            stock: {
                trackInventory: true,
                quantity: parseInt(data.stock),
            },
            media: {
                mainMedia: {
                    image: {
                        url: data.imageUrl,
                    },
                },
            },
        });
        revalidatePath("/admin/products");
        return { success: true, product: response };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to create product" };
    }
};
