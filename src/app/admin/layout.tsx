import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { cookies } from "next/headers";
import * as jose from "jose";

type AdminAccount = {
    name: string;
    role: string;
};

async function getAdminAccountFromCookie(): Promise<AdminAccount | undefined> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return undefined;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev");

    try {
        const { payload } = await jose.jwtVerify(token, secret);

        const nameFromToken = typeof payload.name === "string" ? payload.name.trim() : "";
        const emailFromToken = typeof payload.email === "string" ? payload.email : "";
        const roleFromToken = typeof payload.role === "string" ? payload.role : "ADMIN";

        const name = nameFromToken || emailFromToken.split("@")[0] || "Admin User";
        const role = roleFromToken.charAt(0) + roleFromToken.slice(1).toLowerCase();

        return { name, role };
    } catch {
        return undefined;
    }
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const account = await getAdminAccountFromCookie();
    return <AdminLayoutShell account={account}>{children}</AdminLayoutShell>;
}
