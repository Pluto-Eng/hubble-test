import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from '@/lib/auth/auth.config'
import type { NextAuthRequest } from "next-auth"

export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnAuthPages = nextUrl.pathname.startsWith('/login') || 
                       nextUrl.pathname.startsWith('/signup') ||
                       nextUrl.pathname.startsWith('/confirm-signup')

  // Redirect to login if accessing dashboard without auth
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isOnAuthPages && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup", 
    "/confirm-signup",
    "/api/protected/:path*",
  ],
} 