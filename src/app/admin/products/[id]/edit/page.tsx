export const dynamic = 'force-dynamic';

import { getProductById } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
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

export default async function EditProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const product = await getProductById(id);
    const categories = await getCategories();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Produk</h1>
            </div>

            <Card className="border-none shadow-md bg-card">
                <CardHeader>
                    <CardTitle>Informasi Produk</CardTitle>
                    <CardDescription>
                        Ubah detail produk {product.name} di bawah ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm initialData={product} categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
