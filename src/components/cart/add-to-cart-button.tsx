"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
}

export function AddToCartButton({ product }: { product: ProductItem }) {
    const cart = useCartStore();
    const [added, setAdded] = useState(false);
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [timeoutId]);

    if (product.stock <= 0) {
        return (
            <Button className="w-full gap-2 transition-all" size="sm" variant="secondary" disabled>
                Stok Habis
            </Button>
        )
    }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        cart.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image ?? undefined,
            stock: product.stock
        });
        setAdded(true);
        if (timeoutId) clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => setAdded(false), 1600));
    };

    return (
        <Button
            className="w-full gap-2 transition-all duration-200"
            size="sm"
            onClick={handleAdd}
            variant={added ? "secondary" : "default"}
        >
            <ShoppingCart className="h-4 w-4" />
            {added ? "Ditambahkan!" : "Masukkan Keranjang"}
        </Button>
    );
}
