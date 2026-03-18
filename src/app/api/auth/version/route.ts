import { NextResponse } from "next/server";
import { getAuthTokenVersion } from "@/services/settings.service";

export async function GET() {
  try {
    const version = await getAuthTokenVersion();
    return NextResponse.json({ version });
  } catch {
    return NextResponse.json({ version: 1 });
  }
}
