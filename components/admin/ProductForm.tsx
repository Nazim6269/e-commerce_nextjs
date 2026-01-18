"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProductStock } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        price: initialData?.price?.price || initialData?.priceData?.price || "",
        stock: initialData?.stock?.quantity || "",
        description: initialData?.description || "",
        imageUrl: initialData?.media?.mainMedia?.image?.url || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let result;
        if (isEditing) {
            // Wix updateProduct takes partials. 
            // For now, let's just update stock as requested specifically "inline editing for stock".
            // If the user wants full update, we can expand actions/product.ts
            result = await updateProductStock(initialData._id, parseInt(formData.stock));
        } else {
            result = await createProduct(formData);
        }

        if (result.success) {
            toast.success(isEditing ? "Product updated!" : "Product created!");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast.error(result.error || "Something went wrong");
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? "Edit Product" : "Product Details"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                placeholder="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isEditing} // Wix name update might be trickier or not needed for stock edit
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="29.99"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                disabled={isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                type="number"
                                placeholder="100"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="imageUrl"
                                    placeholder="https://"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    required
                                    disabled={isEditing}
                                />
                                <Button type="button" variant="secondary" size="icon" disabled>
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="description"
                            className="min-h-[150px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={isEditing}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/products">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
