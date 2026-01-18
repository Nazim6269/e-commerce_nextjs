import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { wixClientServer } from "@/lib/wixClientServer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const wixClient = await wixClientServer();

    let product;
    try {
        const response = await wixClient.products.queryProducts().eq("_id", id).find();
        product = response.items[0];
    } catch (err) {
        console.error(err);
        return notFound();
    }

    if (!product) return notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
            </div>

            <ProductForm initialData={product} isEditing={true} />
        </div>
    );
}
