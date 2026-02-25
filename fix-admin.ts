import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const email = "admin@panenhub.com";
        const password = "password123";
        const name = "Admin PanenHub";

        console.log("Checking if user exists...");
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            console.log("Admin already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword, role: "ADMIN" }
            });
            console.log("Admin password updated!");
        } else {
            console.log("Creating new admin user...");
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "ADMIN"
                }
            });
            console.log("Admin created successfully!");
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
