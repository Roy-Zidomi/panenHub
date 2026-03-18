import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { getAuthTokenVersion } from "@/services/settings.service"

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

    const authTokenVersion = await getAuthTokenVersion()

    // Create JWT Token
    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ver: authTokenVersion
        },
        JWT_SECRET,
        { expiresIn: "1d" }
    )

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "LOGIN_SUCCESS",
            details: `Login via email ${user.email}`
        }
    }).catch(() => null)

    // Omit password from response
    const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }

    return {
        user: userWithoutPassword,
        token
    }
}
