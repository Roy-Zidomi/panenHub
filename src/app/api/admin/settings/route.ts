import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { getAppSettings, updateAppSettings, type AppSettingsPatch } from "@/services/settings.service";
import { prisma } from "@/lib/prisma";

const settingsPatchSchema = z.object({
  storeProfile: z
    .object({
      storeName: z.string().min(1).optional(),
      storeDescription: z.string().optional(),
      storeLogoUrl: z.string().optional(),
      contactWhatsapp: z.string().optional(),
      contactEmail: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  checkout: z
    .object({
      adminWhatsapp: z.string().optional(),
      whatsappTemplate: z.string().optional(),
      defaultOrderNote: z.string().optional(),
      allowGuestCheckout: z.boolean().optional(),
    })
    .optional(),
  shipping: z
    .object({
      serviceAreas: z.string().optional(),
      deliveryEstimate: z.string().optional(),
      defaultShippingCost: z.coerce.number().nonnegative().optional(),
      freeShippingMinimum: z.coerce.number().nonnegative().optional(),
    })
    .optional(),
  payment: z
    .object({
      methods: z
        .object({
          bankTransfer: z.boolean().optional(),
          eWallet: z.boolean().optional(),
          cod: z.boolean().optional(),
        })
        .optional(),
      instructions: z.string().optional(),
    })
    .optional(),
  operations: z
    .object({
      openDays: z.array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])).optional(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })
    .optional(),
  notifications: z
    .object({
      newOrder: z.boolean().optional(),
      orderStatus: z.boolean().optional(),
      dailySummary: z.boolean().optional(),
      lowStock: z.boolean().optional(),
      lowStockThreshold: z.coerce.number().int().min(1).max(100).optional(),
    })
    .optional(),
});

export async function GET(req: Request) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [settings, account, recentActivity] = await Promise.all([
    getAppSettings(),
    prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true, updatedAt: true },
    }),
    prisma.activityLog.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, action: true, details: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    settings,
    account,
    recentActivity,
  });
}

export async function PATCH(req: Request) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const patch = settingsPatchSchema.parse(payload) as AppSettingsPatch;
    const settings = await updateAppSettings(patch);

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "SETTINGS_UPDATED",
        details: "Memperbarui pengaturan aplikasi",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data pengaturan tidak valid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
