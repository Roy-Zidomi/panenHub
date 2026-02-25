"use client";

import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const [mounted, setMounted] = useState(false);
    const cart = useCartStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-muted p-6 rounded-full mb-6 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Keranjang Belanja Kosong</h1>
                <p className="text-muted-foreground mb-8 max-w-[400px]">
                    Sepertinya Anda belum menambahkan produk apapun ke keranjang belanja Anda.
                </p>
                <Link href="/products">
                    <Button size="lg">Mulai Belanja</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Keranjang Belanja</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                                <div className="relative w-24 h-24 sm:w-20 sm:h-20 bg-muted rounded-md overflow-hidden shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link href={`/products/${item.id}`} className="hover:underline">
                                        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                                    </Link>
                                    <p className="font-bold text-primary mt-1">
                                        Rp {item.price.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0 justify-between sm:justify-end">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none rounded-l-md"
                                            onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-10 text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none rounded-r-md"
                                            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => cart.removeItem(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total Harga ({cart.items.length} Barang)</span>
                                    <span>Rp {cart.getTotal().toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Tagihan</span>
                                    <span className="text-primary">
                                        Rp {cart.getTotal().toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <Link href="/checkout" className="w-full block">
                                <Button size="lg" className="w-full text-base">
                                    Beli Sekarang
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
