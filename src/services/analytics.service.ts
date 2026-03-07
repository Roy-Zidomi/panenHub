import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

function localDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export async function getDashboardStats() {
    const now = new Date();
    const sevenDaysAgo = startOfDay(new Date(now));
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const salesStatuses: Array<"COMPLETED" | "PROCESSING"> = ["COMPLETED", "PROCESSING"];

    const [
        totalRevenue,
        ordersCount,
        productsCount,
        usersCount,
        newUsersCount,
        recentOrders,
        latestSalesOrder,
    ] = await Promise.all([
        prisma.order.aggregate({
            where: { status: "COMPLETED" },
            _sum: { totalPrice: true },
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
        prisma.user.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { product: true }
                }
            }
        }),
        prisma.order.findFirst({
            where: {
                status: {
                    in: salesStatuses,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                createdAt: true,
            },
        }),
    ]);

    // Default: show current 7-day window. Fallback: last active 7-day window if current has no sales.
    let rangeEnd = endOfDay(now);
    let rangeStart = startOfDay(new Date(rangeEnd));
    rangeStart.setDate(rangeStart.getDate() - 6);

    if (latestSalesOrder && latestSalesOrder.createdAt < rangeStart) {
        rangeEnd = endOfDay(latestSalesOrder.createdAt);
        rangeStart = startOfDay(new Date(rangeEnd));
        rangeStart.setDate(rangeStart.getDate() - 6);
    }

    const ordersForChart = await prisma.order.findMany({
        where: {
            status: {
                in: salesStatuses,
            },
            createdAt: {
                gte: rangeStart,
                lte: rangeEnd,
            },
        },
        select: {
            createdAt: true,
            totalPrice: true,
        },
    });

    const revenueByDay = new Map<string, number>();
    for (const order of ordersForChart) {
        const key = localDateKey(order.createdAt);
        const previous = revenueByDay.get(key) || 0;
        revenueByDay.set(key, previous + order.totalPrice);
    }

    const dailySales = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(rangeStart);
        d.setDate(rangeStart.getDate() + i);
        const key = localDateKey(d);
        const total = revenueByDay.get(key) || 0;

        return {
            date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            revenue: total,
        };
    });

    return {
        revenue: totalRevenue._sum.totalPrice || 0,
        ordersCount,
        productsCount,
        usersCount,
        newUsersCount,
        recentOrders,
        dailySales
    };
}
