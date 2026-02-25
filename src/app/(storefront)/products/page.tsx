export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getProducts } from "@/services/product.service";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import Image from "next/image";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; q?: string };
}) {
    const allProducts = await getProducts();

    // Basic filtering server side for MVP
    const products = allProducts.filter((p: any) => {
        let match = true;
        if (searchParams.category) {
            match = match && p.category.slug === searchParams.category;
        }
        if (searchParams.q) {
            match = match && p.name.toLowerCase().includes(searchParams.q.toLowerCase());
        }
        return match;
    });

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Semua Produk</h1>
                    <p className="text-muted-foreground mt-1">
                        Menampilkan {products.length} produk segar
                    </p>
                </div>

                {/* We'll add a client-side filter/search component later */}
                <div className="w-full md:w-auto flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Link href="/products">
                        <Badge variant={!searchParams.category ? "default" : "outline"} className="px-3 py-1 cursor-pointer">
                            Semua
                        </Badge>
                    </Link>
                    <Link href="/products?category=sayuran">
                        <Badge variant={searchParams.category === "sayuran" ? "default" : "outline"} className="px-3 py-1 cursor-pointer whitespace-nowrap">
                            Sayuran
                        </Badge>
                    </Link>
                    <Link href="/products?category=buah">
                        <Badge variant={searchParams.category === "buah" ? "default" : "outline"} className="px-3 py-1 cursor-pointer whitespace-nowrap">
                            Buah
                        </Badge>
                    </Link>
                    <Link href="/products?category=daging">
                        <Badge variant={searchParams.category === "daging" ? "default" : "outline"} className="px-3 py-1 cursor-pointer whitespace-nowrap">
                            Daging
                        </Badge>
                    </Link>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">Tidak ada produk yang ditemukan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product: any) => (
                        <Card key={product.id} className="overflow-hidden flex flex-col group border-none shadow-sm hover:shadow-md transition-all bg-card/50">
                            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
                                        No Image
                                    </div>
                                )}
                                {product.quality === "Premium" && (
                                    <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 border-none shadow-sm">Premium</Badge>
                                )}
                            </Link>
                            <CardContent className="p-4 flex-1">
                                <div className="text-xs text-muted-foreground mb-1">{product.category.name}</div>
                                <Link href={`/products/${product.id}`} className="hover:underline">
                                    <h3 className="font-semibold line-clamp-2 text-sm md:text-base leading-tight">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="mt-2 font-bold text-primary">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <AddToCartButton product={product} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
