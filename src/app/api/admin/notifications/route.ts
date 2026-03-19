import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { getAppSettings } from "@/services/settings.service";

export async function GET(req: Request) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAppSettings();
    const lowStockThreshold = settings.notifications.lowStockThreshold;
    const openOrderStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.PROCESSING];

    const [latestOrder, openOrderCount, pendingOrderCount, processingOrderCount, lowStockCount, lowStockProducts] = await Promise.all([
      prisma.order.findFirst({
        where: {
          status: {
            in: openOrderStatuses,
          },
        },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          customerName: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.order.count({
        where: {
          status: {
            in: openOrderStatuses,
          },
        },
      }),
      prisma.order.count({
        where: {
          status: OrderStatus.PENDING,
        },
      }),
      prisma.order.count({
        where: {
          status: OrderStatus.PROCESSING,
        },
      }),
      prisma.product.count({
        where: {
          stock: {
            lte: lowStockThreshold,
          },
        },
      }),
      prisma.product.findMany({
        where: {
          stock: {
            lte: lowStockThreshold,
          },
        },
        orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
        take: 8,
        select: {
          id: true,
          name: true,
          stock: true,
          updatedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      settings: {
        newOrder: settings.notifications.newOrder,
        lowStock: settings.notifications.lowStock,
        lowStockThreshold,
      },
      latestOrder,
      orderSummary: {
        openCount: openOrderCount,
        pendingCount: pendingOrderCount,
        processingCount: processingOrderCount,
      },
      lowStock: {
        count: lowStockCount,
        products: lowStockProducts,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Gagal memuat notifikasi admin" }, { status: 500 });
  }
}
