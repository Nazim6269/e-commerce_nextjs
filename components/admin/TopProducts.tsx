import { wixClientServer } from "@/lib/wixClientServer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TopProducts() {
    const wixClient = await wixClientServer();
    let products: any[] = [];
    try {
        const response = await wixClient.products.queryProducts().limit(5).find();
        products = response.items;
    } catch (err) {
        console.error("Failed to fetch products", err);
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {products.map((product) => (
                        <div key={product._id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={product.media?.mainMedia?.image?.url} alt={product.name || "Product"} />
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {product.stock?.inventoryStatus || "In Stock"}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">
                                {product.price?.formatted?.price || "$0.00"}
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <p className="text-sm text-muted-foreground">No products found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
