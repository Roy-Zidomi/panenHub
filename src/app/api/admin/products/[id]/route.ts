import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        if (!id) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prisma.product.update({
            where: {
                id,
            },
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
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        if (!id) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prisma.product.delete({
            where: {
                id,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
