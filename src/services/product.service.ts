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