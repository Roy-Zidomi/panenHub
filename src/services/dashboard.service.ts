import { prisma } from "@/lib/prisma";

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const revenue = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  return {
    ordersToday,
    revenue: revenue._sum.totalPrice,
  };
};
