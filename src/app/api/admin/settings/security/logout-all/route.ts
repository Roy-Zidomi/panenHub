import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { bumpAuthTokenVersion } from "@/services/settings.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const nextVersion = await bumpAuthTokenVersion();

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "LOGOUT_ALL_SESSIONS",
        details: `Menaikkan versi token ke ${nextVersion}`,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Semua sesi berhasil diputus. Silakan login ulang.",
    });

    response.cookies.delete("admin-token");
    return response;
  } catch {
    return NextResponse.json({ error: "Gagal memutus semua sesi" }, { status: 500 });
  }
}
