import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || "";

        // Local image upload handler (multipart/form-data)
        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("file");

            if (!(file instanceof File)) {
                return NextResponse.json({ error: "File gambar tidak ditemukan" }, { status: 400 });
            }

            if (!file.type.startsWith("image/")) {
                return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json({ error: "Ukuran gambar maksimal 5MB" }, { status: 400 });
            }

            const bytes = Buffer.from(await file.arrayBuffer());
            const originalExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const ext = /^[a-z0-9]+$/.test(originalExt) ? originalExt : "jpg";

            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, bytes);

            return NextResponse.json({ url: `/uploads/${fileName}` });
        }

        const body = await req.json();
        const {
            name,
            description,
            price,
            stock,
            categoryId,
            image,
            quality,
            isFeatured
        } = body;

        if (
            !name ||
            price === undefined ||
            price === null ||
            !categoryId
        ) {
            return new NextResponse("Nama, Harga, dan Kategori wajib diisi", { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                categoryId,
                image,
                quality,
                isFeatured
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
