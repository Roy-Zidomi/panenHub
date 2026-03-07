"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, PackageSearch } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

const CATEGORY_OPTIONS = ["Semua", "Sayuran", "Buah", "Daging"] as const;
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
type SortOption = "latest" | "price-asc" | "price-desc";

type ProductItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  quality: string | null;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
};

interface ProductsCatalogProps {
  products: ProductItem[];
  initialCategory?: string;
  initialSearch?: string;
}

function mapCategoryParamToLabel(value?: string): CategoryOption {
  const normalized = (value || "").toLowerCase();

  if (normalized.includes("sayur")) return "Sayuran";
  if (normalized.includes("buah")) return "Buah";
  if (normalized.includes("daging") || normalized.includes("lauk")) return "Daging";
  return "Semua";
}

function isProductInCategory(product: ProductItem, selectedCategory: CategoryOption) {
  if (selectedCategory === "Semua") return true;

  const source = `${product.category.name} ${product.category.slug}`.toLowerCase();

  if (selectedCategory === "Sayuran") {
    return source.includes("sayur");
  }

  if (selectedCategory === "Buah") {
    return source.includes("buah");
  }

  if (selectedCategory === "Daging") {
    return source.includes("daging") || source.includes("lauk") || source.includes("protein");
  }

  return true;
}

export function ProductsCatalog({
  products,
  initialCategory,
  initialSearch,
}: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(
    mapCategoryParamToLabel(initialCategory)
  );
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const idrFormatter = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
      }),
    []
  );

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const categoryMatch = isProductInCategory(product, selectedCategory);
      const searchMatch = product.name.toLowerCase().includes(keyword);

      return categoryMatch && searchMatch;
    });

    const sorted = [...result];

    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return sorted;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Semua Produk</h1>
          <p className="mt-1 text-muted-foreground">
            Menampilkan {filteredProducts.length} produk segar
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari produk berdasarkan nama..."
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full lg:w-[220px]">
              <SelectValue placeholder="Urutkan produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Harga Terendah</SelectItem>
              <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
              <SelectItem value="latest">Produk Terbaru</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-24 text-center">
          <PackageSearch className="mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Produk tidak ditemukan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col overflow-hidden border bg-card/80 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            >
              <Link
                href={`/products/${product.id}`}
                className="relative block aspect-square overflow-hidden bg-muted"
              >
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
              </Link>

              <CardContent className="flex-1 p-4">
                <div className="mb-1 text-xs text-muted-foreground">{product.category.name}</div>
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="line-clamp-2 text-base font-semibold leading-tight">{product.name}</h3>
                </Link>
                <div className="mt-3 text-xl font-bold text-primary">
                  Rp {idrFormatter.format(product.price)}
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
