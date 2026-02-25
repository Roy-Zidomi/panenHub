import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Logout berhasil",
    });

    // Clear cookie
    response.cookies.delete("admin-token");

    return response;
}
