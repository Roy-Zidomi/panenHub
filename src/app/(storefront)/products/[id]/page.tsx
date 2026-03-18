export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProductById } from "@/services/product.service";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
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
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 md:py-12">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">
            Produk
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate text-foreground md:max-w-none">{product.name}</span>
        </nav>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-14">
        <div className="surface-panel reveal-up relative aspect-square w-full overflow-hidden rounded-[1.75rem] p-2 md:h-[520px] md:aspect-auto">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="rounded-[1.35rem] object-cover" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-muted text-muted-foreground">
              Tidak ada foto produk
            </div>
          )}

          {product.quality === "Premium" && (
            <Badge className="absolute left-5 top-5 border-none bg-amber-500 px-3 py-1 text-sm text-white shadow-md hover:bg-amber-600">
              Kualitas Premium
            </Badge>
          )}
        </div>

        <div className="reveal-up reveal-delay-1 flex flex-col">
          <Badge variant="outline" className="mb-4 w-fit">
            {product.category.name}
          </Badge>

          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

          <div className="mb-6 text-3xl font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</div>

          <p className="mb-8 leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {product.description || "Tidak ada deskripsi untuk produk ini."}
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="surface-panel rounded-xl p-4">
              <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Garansi Kualitas</p>
              <p className="text-xs text-muted-foreground">Produk terseleksi dan terjaga</p>
            </div>
            <div className="surface-panel rounded-xl p-4">
              <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <Truck className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Pengiriman Aman</p>
              <p className="text-xs text-muted-foreground">Diproses cepat setiap hari</p>
            </div>
          </div>

          <div className="surface-panel mt-auto space-y-4 rounded-2xl p-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
              <span className="text-muted-foreground">Ketersediaan Stok</span>
              <span className={product.stock > 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                {product.stock > 0 ? `${product.stock} Tersisa` : "Stok Habis"}
              </span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
