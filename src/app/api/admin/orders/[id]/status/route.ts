import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

const updateStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});

class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    try {
        if (!id) {
            return new NextResponse("Order ID is required", { status: 400 });
        }

        const body = await req.json();
        const parsed = updateStatusSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Status tidak valid",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const nextStatus = parsed.data.status;

        const order = await prisma.$transaction(async (tx) => {
            const existingOrder = await tx.order.findUnique({
                where: { id },
                include: {
                    items: {
                        select: {
                            productId: true,
                            quantity: true,
                        },
                    },
                },
            });

            if (!existingOrder) {
                throw new ApiError(404, "Order tidak ditemukan");
            }

            if (existingOrder.status === nextStatus) {
                return tx.order.findUniqueOrThrow({
                    where: { id },
                });
            }

            const isCancelling = existingOrder.status !== OrderStatus.CANCELLED && nextStatus === OrderStatus.CANCELLED;
            const isReactivating = existingOrder.status === OrderStatus.CANCELLED && nextStatus !== OrderStatus.CANCELLED;

            if (isCancelling) {
                for (const item of existingOrder.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }

            if (isReactivating) {
                for (const item of existingOrder.items) {
                    const decrementResult = await tx.product.updateMany({
                        where: {
                            id: item.productId,
                            stock: {
                                gte: item.quantity,
                            },
                        },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });

                    if (decrementResult.count === 0) {
                        throw new ApiError(409, "Stok tidak cukup untuk mengaktifkan kembali order", {
                            productId: item.productId,
                            requiredQty: item.quantity,
                        });
                    }
                }
            }

            return tx.order.update({
                where: { id },
                data: {
                    status: nextStatus,
                },
            });
        });

        return NextResponse.json(order);
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                {
                    error: error.message,
                    details: error.details,
                },
                { status: error.status }
            );
        }

        console.log("[ORDER_STATUS_PATCH]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
