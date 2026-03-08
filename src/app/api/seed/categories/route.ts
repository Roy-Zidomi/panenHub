import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const categories = [
    { name: "Sayur", slug: "sayur" },
    { name: "Buah-buahan", slug: "buah-buahan" },
    { name: "Bumbu Dapur", slug: "bumbu-dapur" },
    { name: "Daging", slug: "daging" },
    { name: "Telur", slug: "telur" },
    { name: "Sembako", slug: "sembako" },
    { name: "Snack", slug: "snack" },
];

export async function GET() {
    try {
        const results = await Promise.all(
            categories.map((category) =>
                prisma.category.upsert({
                    where: { slug: category.slug },
                    update: {},
                    create: category,
                })
            )
        );

        return NextResponse.json({
            message: "Categories seeded successfully",
            count: results.length,
        });
    } catch (error) {
        console.error("[SEED_CATEGORIES]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
