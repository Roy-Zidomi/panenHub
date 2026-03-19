import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().trim().min(1, "Nomor telepon wajib diisi"),
  customerAddress: z.string().trim().min(1, "Alamat pengiriman wajib diisi"),
  locationUrl: z.string().trim().url("Link lokasi Google Maps tidak valid"),
  notes: z.string().trim().optional().nullable(),
  userId: z.string().trim().optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Minimal satu item pesanan"),
});

function composeOrderNotes(customerNotes: string | null | undefined, locationUrl: string): string {
  const cleanedNote = customerNotes?.trim() ?? "";
  const cleanedLocation = locationUrl.trim();

  if (cleanedNote.length === 0) {
    return `[LOKASI_MAPS] ${cleanedLocation}`;
  }

  return `${cleanedNote}\n\n[LOKASI_MAPS] ${cleanedLocation}`;
}

type NormalizedOrderItem = {
  productId: string;
  quantity: number;
};

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function normalizeOrderItems(items: Array<{ productId: string; quantity: number }>): NormalizedOrderItem[] {
  const quantityByProduct = new Map<string, number>();

  for (const item of items) {
    const previous = quantityByProduct.get(item.productId) || 0;
    quantityByProduct.set(item.productId, previous + item.quantity);
  }

  return Array.from(quantityByProduct.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Payload pesanan tidak valid",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const normalizedItems = normalizeOrderItems(payload.items);

    const order = await prisma.$transaction(async (tx) => {
      const productIds = normalizedItems.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      });

      const productById = new Map(products.map((product) => [product.id, product]));
      const missingProductIds = productIds.filter((id) => !productById.has(id));

      if (missingProductIds.length > 0) {
        throw new ApiError(404, "Ada produk yang sudah tidak tersedia", { missingProductIds });
      }

      let computedTotalPrice = 0;
      const orderItemsData: Array<{
        productId: string;
        quantity: number;
        price: number;
      }> = [];

      for (const item of normalizedItems) {
        const product = productById.get(item.productId);
        if (!product) {
          throw new ApiError(404, "Produk tidak ditemukan", { productId: item.productId });
        }

        const stockUpdateResult = await tx.product.updateMany({
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

        if (stockUpdateResult.count === 0) {
          throw new ApiError(409, "Stok produk tidak mencukupi", {
            insufficientItem: {
              productId: product.id,
              productName: product.name,
              requestedQty: item.quantity,
              availableStock: product.stock,
            },
          });
        }

        computedTotalPrice += Number(product.price) * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: Number(product.price),
        });
      }

      return tx.order.create({
        data: {
          userId: payload.userId || null,
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          customerAddress: payload.customerAddress,
          notes: composeOrderNotes(payload.notes, payload.locationUrl),
          totalPrice: computedTotalPrice,
          items: {
            create: orderItemsData.map((item) => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
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

    console.error("[API_CREATE_ORDER]", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
