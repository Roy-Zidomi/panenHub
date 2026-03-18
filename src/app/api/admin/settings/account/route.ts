import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { getAuthTokenVersion } from "@/services/settings.service";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";

const updateAccountSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateAccountSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) {
      return NextResponse.json({ error: "Akun admin tidak ditemukan" }, { status: 404 });
    }

    const dataToUpdate: { name?: string; email?: string; password?: string } = {};

    if (parsed.name && parsed.name !== user.name) dataToUpdate.name = parsed.name;
    if (parsed.email && parsed.email !== user.email) dataToUpdate.email = parsed.email;

    if (parsed.newPassword) {
      if (!parsed.currentPassword) {
        return NextResponse.json({ error: "Password saat ini wajib diisi" }, { status: 400 });
      }

      const validPassword = await bcrypt.compare(parsed.currentPassword, user.password);
      if (!validPassword) {
        return NextResponse.json({ error: "Password saat ini tidak cocok" }, { status: 400 });
      }

      dataToUpdate.password = await bcrypt.hash(parsed.newPassword, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "Tidak ada perubahan data akun" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "ACCOUNT_UPDATED",
        details: "Memperbarui profil akun admin",
      },
    });

    const authTokenVersion = await getAuthTokenVersion();
    const token = jwt.sign(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        ver: authTokenVersion,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      account: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data akun tidak valid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memperbarui akun" }, { status: 500 });
  }
}
