import { prisma } from "./src/lib/prisma";

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: "admin@panenhub.com" }
        });
        console.log("USER_FOUND:", user ? "YES" : "NO");
        if (user) {
            console.log("ROLE:", user.role);
        }
    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
