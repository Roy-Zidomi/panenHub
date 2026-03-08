import { prisma } from "@/lib/prisma";

const STANDARD_CATEGORIES = [
    { name: "Sayur", slug: "sayur" },
    { name: "Buah-buahan", slug: "buah-buahan" },
    { name: "Bumbu Dapur", slug: "bumbu-dapur" },
    { name: "Daging", slug: "daging" },
    { name: "Telur", slug: "telur" },
    { name: "Sembako", slug: "sembako" },
    { name: "Snack", slug: "snack" },
] as const;

const LEGACY_SLUG_MAP: Record<string, (typeof STANDARD_CATEGORIES)[number]["slug"]> = {
    "sayur-segar": "sayur",
    "lauk-pauk": "daging",
    "snack-minuman": "snack",
};

async function normalizeCategories() {
    await prisma.$transaction(async (tx) => {
        const existing = await tx.category.findMany();
        const bySlug = new Map(existing.map((category) => [category.slug, category]));

        for (const [legacySlug, targetSlug] of Object.entries(LEGACY_SLUG_MAP)) {
            const legacyCategory = bySlug.get(legacySlug);
            if (!legacyCategory) continue;

            const targetDefinition = STANDARD_CATEGORIES.find(
                (category) => category.slug === targetSlug
            );
            if (!targetDefinition) continue;

            const targetCategory = bySlug.get(targetSlug);

            if (targetCategory && targetCategory.id !== legacyCategory.id) {
                await tx.product.updateMany({
                    where: { categoryId: legacyCategory.id },
                    data: { categoryId: targetCategory.id },
                });

                await tx.category.delete({
                    where: { id: legacyCategory.id },
                });

                if (targetCategory.name !== targetDefinition.name) {
                    const updatedTarget = await tx.category.update({
                        where: { id: targetCategory.id },
                        data: { name: targetDefinition.name },
                    });
                    bySlug.set(targetSlug, updatedTarget);
                }

                bySlug.delete(legacySlug);
                continue;
            }

            const renamedLegacy = await tx.category.update({
                where: { id: legacyCategory.id },
                data: {
                    name: targetDefinition.name,
                    slug: targetDefinition.slug,
                },
            });

            bySlug.delete(legacySlug);
            bySlug.set(targetDefinition.slug, renamedLegacy);
        }

        for (const category of STANDARD_CATEGORIES) {
            const existingCategory = bySlug.get(category.slug);

            if (existingCategory) {
                if (existingCategory.name !== category.name) {
                    const updated = await tx.category.update({
                        where: { id: existingCategory.id },
                        data: { name: category.name },
                    });
                    bySlug.set(category.slug, updated);
                }
                continue;
            }

            const created = await tx.category.create({
                data: {
                    name: category.name,
                    slug: category.slug,
                },
            });
            bySlug.set(category.slug, created);
        }
    });
}

export async function getCategories() {
    await normalizeCategories();

    const categories = await prisma.category.findMany({
        where: {
            slug: {
                in: STANDARD_CATEGORIES.map((category) => category.slug),
            },
        },
    });

    const order = new Map(STANDARD_CATEGORIES.map((category, index) => [category.slug, index]));

    return categories.sort((a, b) => {
        const aOrder = order.get(a.slug) ?? 999;
        const bOrder = order.get(b.slug) ?? 999;
        return aOrder - bOrder;
    });
}
