import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerAddress,
      notes,
      totalPrice,
      items,
      userId,
    } = body;

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerName,
        customerPhone,
        customerAddress,
        notes: notes || null,
        totalPrice: Number(totalPrice) || 0,
        items: {
          create: items.map((it: any) => ({
            product: { connect: { id: it.productId } },
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[API_CREATE_ORDER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
