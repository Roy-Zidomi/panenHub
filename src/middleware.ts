import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev"

type AdminTokenPayload = {
    role?: unknown
    ver?: unknown
}

async function getAdminTokenPayload(token: string): Promise<AdminTokenPayload> {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as AdminTokenPayload
}

async function getAuthTokenVersion(request: NextRequest): Promise<number | null> {
    try {
        const response = await fetch(new URL('/api/auth/version', request.url), { cache: 'no-store' })
        if (!response.ok) return null

        const data = await response.json() as { version?: number }
        return typeof data.version === 'number' ? data.version : null
    } catch {
        return null
    }
}

function isAdminTokenValid(payload: AdminTokenPayload, currentVersion: number | null) {
    if (payload.role !== 'ADMIN') return false

    if (currentVersion === null) return true
    const tokenVersion = typeof payload.ver === 'number' ? payload.ver : 1
    return tokenVersion === currentVersion
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAdminRoute = pathname.startsWith('/admin')
    const isLoginPage = pathname.startsWith('/admin/login')

    if (!isAdminRoute) {
        return NextResponse.next()
    }

    const token = request.cookies.get('admin-token')?.value

    if (isLoginPage) {
        if (!token) return NextResponse.next()

        try {
            const [payload, currentVersion] = await Promise.all([
                getAdminTokenPayload(token),
                getAuthTokenVersion(request)
            ])

            if (isAdminTokenValid(payload, currentVersion)) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        } catch {
            return NextResponse.next()
        }

        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
        const [payload, currentVersion] = await Promise.all([
            getAdminTokenPayload(token),
            getAuthTokenVersion(request)
        ])

        if (!isAdminTokenValid(payload, currentVersion)) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
