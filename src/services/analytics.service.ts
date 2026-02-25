import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function getDashboardStats() {
    const [totalRevenue, ordersCount, productsCount, recentOrders] = await Promise.all([
        prisma.order.aggregate({
            where: { status: "COMPLETED" },
            _sum: { totalPrice: true },
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { product: true }
                }
            }
        }),
    ]);

    // Generate chart data for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await prisma.order.groupBy({
        by: ["createdAt"],
        where: {
            status: "COMPLETED",
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
        _sum: {
            totalPrice: true,
        },
    });

    // Process data for the chart
    const dailySales = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });

        const dayTotal = salesData.filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate.getDate() === d.getDate() && itemDate.getMonth() === d.getMonth();
        }).reduce((acc, curr) => acc + (curr._sum.totalPrice || 0), 0);

        return {
            date: dateStr,
            revenue: dayTotal
        };
    });

    return {
        revenue: totalRevenue._sum.totalPrice || 0,
        ordersCount,
        productsCount,
        recentOrders,
        dailySales
    };
}
