"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { deleteProduct } from "@/actions/product";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import Link from "next/link";

interface ProductRowActionsProps {
    productId: string;
    productName: string;
}

export default function ProductRowActions({ productId, productName }: ProductRowActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${productName}?`)) return;

        setIsLoading(true);
        const result = await deleteProduct(productId);
        if (result.success) {
            toast.success("Product deleted");
        } else {
            toast.error(result.error || "Failed to delete");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/products/${productId}`}>
                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" title="Edit Product">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>
            <Button variant="outline" size="icon" className="h-8 w-8 text-yellow-500" title="Feature Product">
                <Star className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600"
                onClick={onDelete}
                disabled={isLoading}
                title="Delete Product"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    );
}
