import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            price,
            stock,
            categoryId,
            image,
            quality,
            isFeatured
        } = body;

        if (!name || !price || !categoryId) {
            return new NextResponse("Nama, Harga, dan Kategori wajib diisi", { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                categoryId,
                image,
                quality,
                isFeatured
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
