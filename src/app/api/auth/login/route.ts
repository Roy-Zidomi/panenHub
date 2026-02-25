import { NextResponse } from "next/server";
import { loginUser, loginSchema } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const validatedData = loginSchema.parse(body);

        const { user, token } = await loginUser(validatedData);

        const response = NextResponse.json({
            success: true,
            message: "Login berhasil",
            user,
        });

        // Set HTTP-only cookie
        response.cookies.set("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, message: "Validasi gagal", errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message || "Terjadi kesalahan" },
            { status: 401 }
        );
    }
}
