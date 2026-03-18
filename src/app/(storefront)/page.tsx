import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Apple,
  ArrowRight,
  Carrot,
  Drumstick,
  Egg,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { AboutSection } from "@/components/AboutSection";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getBestSellingProducts } from "@/services/product.service";

const categories = [
  {
    name: "Sayuran Segar",
    icon: Carrot,
    query: "sayuran",
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Buah-buahan",
    icon: Apple,
    query: "buah",
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    name: "Daging Pilihan",
    icon: Drumstick,
    query: "daging",
    accent: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    name: "Telur & Protein",
    icon: Egg,
    query: "telur",
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

export default async function Home() {
  const bestSellingProducts = await getBestSellingProducts(4);

  return (
    <div className="flex flex-col gap-8 pb-12 md:gap-10 md:pb-14">
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-28">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 sm:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="reveal-up max-w-xl space-y-6">
              <div className="inline-flex items-center rounded-full border border-border/70 bg-card/75 px-3 py-1 text-xs font-semibold text-muted-foreground">
                Marketplace UMKM Indonesia
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                Bahan Pangan Segar, <span className="text-primary">Langsung dari Mitra Lokal</span>
              </h1>
              <p className="text-lg text-muted-foreground md:pr-10">
                Belanja kebutuhan harian dengan kualitas terpilih, harga adil, dan pengiriman cepat dari pelaku usaha
                sekitar Anda.
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Belanja Sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
              <div className="grid max-w-md grid-cols-3 gap-3 pt-2 text-center">
                <div className="surface-panel rounded-xl p-3">
                  <p className="text-lg font-bold">500+</p>
                  <p className="text-xs text-muted-foreground">Produk</p>
                </div>
                <div className="surface-panel rounded-xl p-3">
                  <p className="text-lg font-bold">200+</p>
                  <p className="text-xs text-muted-foreground">UMKM</p>
                </div>
                <div className="surface-panel rounded-xl p-3">
                  <p className="text-lg font-bold">24H</p>
                  <p className="text-xs text-muted-foreground">Respon Admin</p>
                </div>
              </div>
            </div>

            <div className="reveal-up reveal-delay-2 relative hidden md:block">
              <div className="surface-panel relative h-[500px] w-full overflow-hidden rounded-[2rem] p-2">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                  alt="Fresh produce"
                  fill
                  className="rounded-[1.5rem] object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="container mx-auto px-4 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <Card className="surface-panel interactive-lift reveal-up rounded-2xl border-none">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">100% Segar & Alami</h3>
                <p className="text-sm text-muted-foreground">Bahan pangan dipilih dan dikirim langsung pada hari yang sama.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-panel interactive-lift reveal-up reveal-delay-1 rounded-2xl border-none">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Kualitas Terjamin</h3>
                <p className="text-sm text-muted-foreground">Pengecekan kualitas ketat untuk memastikan standar terbaik.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-panel interactive-lift reveal-up reveal-delay-2 rounded-2xl border-none">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Pengiriman Cepat</h3>
                <p className="text-sm text-muted-foreground">Pesanan sampai ke alamat Anda dengan aman dan tepat waktu.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Kategori Pilihan</h2>
          <Button variant="ghost" className="hidden gap-2 sm:flex">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/products?category=${cat.query}`}>
                <Card
                  className={[
                    "surface-panel interactive-lift reveal-up cursor-pointer overflow-hidden rounded-2xl border-none",
                    index === 0
                      ? "reveal-delay-1"
                      : index === 1
                        ? "reveal-delay-2"
                        : index === 2
                          ? "reveal-delay-3"
                          : "reveal-delay-4",
                  ].join(" ")}
                >
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center md:p-8">
                    <div className={`rounded-2xl p-3 ${cat.accent}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-foreground/90">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Button variant="ghost" className="mt-4 w-full gap-2 sm:hidden">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <section className="container mx-auto px-4 pt-8 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produk Terlaris</h2>
            <p className="mt-1 text-sm text-muted-foreground">Rekomendasi produk dengan performa penjualan terbaik.</p>
          </div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {bestSellingProducts.length === 0 ? (
          <div className="surface-panel rounded-xl border border-dashed p-12 text-center">
            <p className="font-medium">Belum ada data produk terlaris.</p>
            <p className="text-sm text-muted-foreground">Data akan muncul otomatis setelah ada transaksi selesai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {bestSellingProducts.map((product, index) => (
              <Card
                key={product.id}
                className={[
                  "surface-panel interactive-lift reveal-up group flex flex-col overflow-hidden rounded-2xl border",
                  index === 0
                    ? "reveal-delay-1"
                    : index === 1
                      ? "reveal-delay-2"
                      : index === 2
                        ? "reveal-delay-3"
                        : "reveal-delay-4",
                ].join(" ")}
              >
                <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-muted">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-secondary-foreground">
                      No Image
                    </div>
                  )}

                  {product.quality === "Premium" && (
                    <Badge className="absolute right-2 top-2 border-none bg-amber-500 shadow-sm hover:bg-amber-600">
                      Premium
                    </Badge>
                  )}

                  {product.soldCount > 0 && (
                    <Badge variant="secondary" className="absolute left-2 top-2 border border-border/60 bg-background/85">
                      Terjual {product.soldCount}
                    </Badge>
                  )}
                </Link>

                <CardContent className="flex-1 p-4">
                  <div className="mb-1 text-xs text-muted-foreground">{product.category.name}</div>
                  <Link href={`/products/${product.id}`} className="hover:underline">
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight">{product.name}</h3>
                  </Link>
                  <div className="mt-3 text-xl font-bold text-primary">Rp {new Intl.NumberFormat("id-ID").format(product.price)}</div>
                </CardContent>

                <div className="p-4 pt-0">
                  <AddToCartButton product={product} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
