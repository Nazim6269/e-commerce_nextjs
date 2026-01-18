import { wixClientServer } from "@/lib/wixClientServer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductRowActions from "@/components/admin/ProductRowActions";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export default async function ProductsPage() {
    const wixClient = await wixClientServer();
    let products: any[] = [];
    try {
        const response = await wixClient.products.queryProducts().find();
        products = response.items;
    } catch (err) {
        console.error("Failed to fetch products", err);
    }

    const lowStockCount = products.filter(p => (p.stock?.quantity ?? 0) < 10).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {lowStockCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                        <p className="text-sm text-red-700 font-medium">
                            Inventory Alert: {lowStockCount} items are low on stock (less than 10 units remaining).
                        </p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={product.media?.mainMedia?.image?.url} alt={product.name} />
                                            <AvatarFallback>P</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock?.inventoryStatus === 'IN_STOCK' ? 'default' : 'outline'}>
                                            {product.stock?.inventoryStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{product.price?.formatted?.price}</TableCell>
                                    <TableCell className={product.stock?.quantity < 10 ? "text-red-600 font-bold" : ""}>
                                        {product.stock?.quantity ?? 'N/A'}
                                        {product.stock?.quantity < 10 && <span className="ml-2 text-[10px] uppercase">Low Stock</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ProductRowActions productId={product._id} productName={product.name} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {products.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">
                            No products found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
