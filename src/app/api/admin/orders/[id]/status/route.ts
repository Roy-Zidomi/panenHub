import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { status } = body;

        if (!id) {
            return new NextResponse("Order ID is required", { status: 400 });
        }

        if (!status || !Object.values(OrderStatus).includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        const order = await prisma.order.update({
            where: {
                id,
            },
            data: {
                status: status as OrderStatus,
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_STATUS_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
