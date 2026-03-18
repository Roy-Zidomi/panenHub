import * as jose from "jose";

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: string;
  ver: number;
};

function getCookieValue(cookieHeader: string | null, key: string): string | undefined {
  if (!cookieHeader) return undefined;
  const pairs = cookieHeader.split(";").map((part) => part.trim());
  const match = pairs.find((part) => part.startsWith(`${key}=`));
  return match?.split("=")[1];
}

export async function getAdminSessionFromRequest(req: Request): Promise<AdminSession | null> {
  const token = getCookieValue(req.headers.get("cookie"), "admin-token");
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev");

  try {
    const { payload } = await jose.jwtVerify(token, secret);

    const role = typeof payload.role === "string" ? payload.role : "";
    if (role !== "ADMIN") return null;

    const id = typeof payload.id === "string" ? payload.id : "";
    if (!id) return null;

    const email = typeof payload.email === "string" ? payload.email : "";
    const nameFromToken = typeof payload.name === "string" ? payload.name.trim() : "";
    const name = nameFromToken || email.split("@")[0] || "Admin User";
    const ver = typeof payload.ver === "number" ? payload.ver : 1;

    return {
      id,
      name,
      email,
      role,
      ver,
    };
  } catch {
    return null;
  }
}
