"use client";

import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useHydrated } from "@/hooks/use-hydrated";

export default function CartPage() {
  const mounted = useHydrated();
  const cart = useCartStore();

  if (!mounted) return null;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 rounded-full bg-muted p-6 text-muted-foreground">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="font-display mb-2 text-3xl font-bold">Keranjang Belanja Kosong</h1>
        <p className="mb-8 max-w-[400px] text-muted-foreground">
          Sepertinya Anda belum menambahkan produk apapun ke keranjang belanja Anda.
        </p>
        <Link href="/products">
          <Button size="lg">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 md:py-12">
      <h1 className="font-display mb-8 text-3xl font-bold tracking-tight">Keranjang Belanja</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item, index) => (
            <Card
              key={item.id}
              className={[
                "surface-panel reveal-up overflow-hidden rounded-2xl border",
                index % 2 === 0 ? "reveal-delay-1" : "reveal-delay-2",
              ].join(" ")}
            >
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-20">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.id}`} className="hover:underline">
                    <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>
                  </Link>
                  <p className="mt-1 font-bold text-primary">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4 sm:mt-0 sm:justify-end sm:gap-6">
                  <div className="flex items-center rounded-lg border border-border/70 bg-card/70">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none rounded-l-lg"
                      onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none rounded-r-lg"
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
          <Card className="surface-panel sticky top-24 rounded-2xl border">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold">Ringkasan Belanja</h2>

              <div className="mb-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Harga ({cart.items.length} Barang)</span>
                  <span>Rp {cart.getTotal().toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="mb-6 border-t border-border/70 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Tagihan</span>
                  <span className="text-primary">Rp {cart.getTotal().toLocaleString("id-ID")}</span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
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
