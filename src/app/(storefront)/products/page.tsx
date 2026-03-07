export const dynamic = 'force-dynamic';

import { getProducts } from "@/services/product.service";
import { ProductsCatalog } from "@/components/product/ProductsCatalog";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; q?: string }>;
}) {
    const params = await searchParams;
    const allProducts = await getProducts();
    const products = allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        quality: product.quality,
        createdAt: product.createdAt.toISOString(),
        category: {
            name: product.category.name,
            slug: product.category.slug,
        },
    }));

    return (
        <ProductsCatalog
            products={products}
            initialCategory={params.category}
            initialSearch={params.q}
        />
    );
}
