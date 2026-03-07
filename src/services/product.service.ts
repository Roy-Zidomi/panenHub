import { prisma } from "@/lib/prisma"

export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  })
}

export const getBestSellingProducts = async (limit = 4) => {
  const soldItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "COMPLETED",
      },
    },
    select: {
      productId: true,
      quantity: true,
    },
  });

  const soldCountMap = new Map<string, number>();
  for (const item of soldItems) {
    const previous = soldCountMap.get(item.productId) || 0;
    soldCountMap.set(item.productId, previous + item.quantity);
  }

  const topProductIds = Array.from(soldCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => productId);

  if (topProductIds.length === 0) {
    const fallbackProducts = await prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
        },
      },
      include: {
        category: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return fallbackProducts.map((product) => ({
      ...product,
      soldCount: 0,
    }));
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: topProductIds,
      },
    },
    include: {
      category: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  return topProductIds
    .map((productId) => {
      const product = productMap.get(productId);
      if (!product) return null;

      return {
        ...product,
        soldCount: soldCountMap.get(productId) || 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
