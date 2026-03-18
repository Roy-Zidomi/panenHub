export const dynamic = 'force-dynamic';

import { getCategories } from "@/services/category.service";
import { ProductForm } from "@/components/admin/ProductForm";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="reveal-up flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Tambah Produk Baru</h1>
            </div>

            <Card className="surface-panel reveal-up reveal-delay-1 rounded-2xl border">
                <CardHeader>
                    <CardTitle>Informasi Produk</CardTitle>
                    <CardDescription>
                        Lengkapi detail produk di bawah ini untuk menambahkan ke marketplace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
