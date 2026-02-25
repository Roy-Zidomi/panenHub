export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getProductById } from "@/services/product.service";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} | PanenHub`,
        description: product.description || `Beli ${product.name} segar di PanenHub`,
    };
}

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
            <div className="mb-6">
                <nav className="text-sm text-muted-foreground flex items-center gap-2">
                    <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-primary transition-colors">Produk</Link>
                    <span>/</span>
                    <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                        {product.category.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px] md:max-w-none">{product.name}</span>
                </nav>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                {/* Product Image */}
                <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full bg-muted rounded-2xl overflow-hidden border">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Tidak ada foto produk
                        </div>
                    )}
                    {product.quality === "Premium" && (
                        <Badge className="absolute top-4 left-4 text-sm px-3 py-1 bg-amber-500 hover:bg-amber-600 border-none text-white shadow-md">
                            Kualitas Premium
                        </Badge>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <Badge variant="outline" className="w-fit mb-4">{product.category.name}</Badge>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>

                    <div className="text-3xl font-bold text-primary mb-6">
                        Rp {product.price.toLocaleString("id-ID")}
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-wrap">
                        {product.description || "Tidak ada deskripsi untuk produk ini."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-dashed">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <div className="text-sm font-medium">Garansi<br /><span className="text-muted-foreground font-normal">Kualitas 100%</span></div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-dashed">
                            <Truck className="h-5 w-5 text-primary" />
                            <div className="text-sm font-medium">Pengiriman<br /><span className="text-muted-foreground font-normal">Cepat & Aman</span></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="flex items-center justify-between text-sm py-3 border-y">
                            <span className="text-muted-foreground">Ketersediaan Stok</span>
                            <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? `${product.stock} Tersisa` : 'Stok Habis'}
                            </span>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center border rounded-md h-12 px-4 shadow-sm w-32">
                                <button className="text-muted-foreground hover:text-foreground text-xl leading-none px-2">-</button>
                                <span className="flex-1 text-center font-medium">1</span>
                                <button className="text-muted-foreground hover:text-foreground text-xl leading-none px-2">+</button>
                            </div>
                            <Button size="lg" className="flex-1 h-12 gap-2 text-base" disabled={product.stock <= 0}>
                                <ShoppingCart className="h-5 w-5" />
                                {product.stock > 0 ? 'Masukkan Keranjang' : 'Habis'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
