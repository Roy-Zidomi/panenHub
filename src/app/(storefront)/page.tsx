import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
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
                <Link href="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                alt="Fresh produce"
                className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

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

      {/* Featured Products Placeholder */}
      <section className="container mx-auto px-4 sm:px-8 text-center pt-8">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-left">Produk Terlaris</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* We will populate this from the database later or in the next task */}
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="w-full h-48 bg-muted rounded-xl"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
