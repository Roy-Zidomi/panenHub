import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev"

export async function middleware(request: NextRequest) {
    // Protect /admin routes (excluding the login page itself if you have one under /admin/login)
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin-token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            // Verify token
            const secret = new TextEncoder().encode(JWT_SECRET)
            const { payload } = await jose.jwtVerify(token, secret)

            // Basic role check
            if (payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url))
            }

            return NextResponse.next()
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
