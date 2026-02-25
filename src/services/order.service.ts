import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function getOrders() {
    return prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getOrderById(id: string) {
    return prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
        where: { id },
        data: { status },
    });
}
