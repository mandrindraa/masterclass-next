import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
})

// Define public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup"]

// Define role-based route access
const roleBasedRoutes = {
  admin: ["/dashboard", "/students", "/teachers", "/courses", "/classrooms", "/notes", "/reports"],
  teacher: ["/dashboard", "/students", "/courses", "/classrooms", "/notes", "/reports"],
  student: ["/dashboard", "/courses", "/notes"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle root path redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url))
  }

  // Extract locale from pathname
  const pathnameIsMissingLocale = ["en", "fr"].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // If locale is missing, redirect to default locale
  if (pathnameIsMissingLocale) {
    const locale = request.headers.get("accept-language")?.includes("fr") ? "fr" : "en"
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  // Extract the actual path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/"

  // Allow public routes
  if (publicRoutes.includes(pathWithoutLocale)) {
    return intlMiddleware(request)
  }

  // Check for authentication token in cookies
  const authToken = request.cookies.get("auth-token")?.value

  // If no auth token, redirect to signin
  if (!authToken) {
    const locale = pathname.split("/")[1]
    const signinUrl = new URL(`/${locale}/auth/signin`, request.url)
    signinUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signinUrl)
  }

  try {
    // Parse the auth token
    const userData = JSON.parse(decodeURIComponent(authToken))
    const userRole = userData.role?.toLowerCase()

    // Check role-based access
    const allowedRoutes = roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || []

    // Check if current path starts with any allowed route
    const hasAccess = allowedRoutes.some((route) => pathWithoutLocale.startsWith(route) || pathWithoutLocale === route)

    if (!hasAccess) {
      // Redirect to dashboard if user doesn't have access to specific route
      const locale = pathname.split("/")[1]
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }

    return intlMiddleware(request)
  } catch (error) {
    // If token is invalid, redirect to signin
    const locale = pathname.split("/")[1]
    const signinUrl = new URL(`/${locale}/auth/signin`, request.url)
    signinUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signinUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
