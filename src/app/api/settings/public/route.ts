import { NextResponse } from "next/server";
import { getPublicStoreSettings } from "@/services/settings.service";

export async function GET() {
  try {
    const settings = await getPublicStoreSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Gagal memuat pengaturan publik" }, { status: 500 });
  }
}
