import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import { AboutSection } from "@/components/AboutSection";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getBestSellingProducts } from "@/services/product.service";

export default async function Home() {
  const bestSellingProducts = await getBestSellingProducts(4);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-muted/30 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                #1 UMKM Food Marketplace
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Bahan Pangan Segar, <span className="text-primary">Langsung dari Petani</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Dukung UMKM lokal dengan kemudahan berbelanja sayuran, buah, daging, dan telur segar berkualitas dengan harga terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Belanja Sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                  alt="Fresh produce"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <Card className="border-none shadow-none bg-muted/40">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">100% Segar & Alami</h3>
                <p className="text-sm text-muted-foreground">Bahan pangan dipilih dan dikirim langsung pada hari yang sama.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-muted/40">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Kualitas Terjamin</h3>
                <p className="text-sm text-muted-foreground">Pengecekan kualitas ketat untuk memastikan standar terbaik.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-muted/40">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pengiriman Cepat</h3>
                <p className="text-sm text-muted-foreground">Pesanan sampai ke alamat Anda dengan aman dan tepat waktu.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Kategori Pilihan</h2>
          <Button variant="ghost" className="gap-2 hidden sm:flex">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Sayuran Segar", emoji: "🥬", color: "bg-emerald-100 dark:bg-emerald-900/30", query: "sayuran" },
            { name: "Buah-buahan", emoji: "🍎", color: "bg-rose-100 dark:bg-rose-900/30", query: "buah" },
            { name: "Daging Pilihan", emoji: "🥩", color: "bg-red-100 dark:bg-red-900/30", query: "daging" },
            { name: "Telur & Protein", emoji: "🥚", color: "bg-amber-100 dark:bg-amber-900/30", query: "telur" },
          ].map((cat) => (
            <Link key={cat.name} href={`/products?category=${cat.query}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-none bg-muted/20">
                <CardContent className={`p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 ${cat.color}`}>
                  <span className="text-4xl md:text-5xl">{cat.emoji}</span>
                  <h3 className="font-semibold text-foreground/90">{cat.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Button variant="ghost" className="gap-2 sm:hidden w-full mt-4">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <section className="container mx-auto px-4 sm:px-8 pt-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produk Terlaris</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rekomendasi produk dengan performa penjualan terbaik.
            </p>
          </div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {bestSellingProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center">
            <p className="font-medium">Belum ada data produk terlaris.</p>
            <p className="text-sm text-muted-foreground">
              Data akan muncul otomatis setelah ada transaksi selesai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {bestSellingProducts.map((product) => (
              <Card
                key={product.id}
                className="group flex flex-col overflow-hidden border bg-card/80 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
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
                  <div className="mt-3 text-xl font-bold text-primary">
                    Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                  </div>
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
