import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev"

export const loginSchema = z.object({
    email: z.string().email("Format email salah"),
    password: z.string().min(6, "Password minimal 6 karakter")
})

type LoginParams = z.infer<typeof loginSchema>

export async function loginUser(data: LoginParams) {
    const { email, password } = data

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new Error("Email atau password salah")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error("Email atau password salah")
    }

    // Create JWT Token
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "1d" }
    )

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user

    return {
        user: userWithoutPassword,
        token
    }
}
