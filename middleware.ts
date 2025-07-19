import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup", "/"]

// Define role-based route access
const roleBasedRoutes = {
  admin: ["/dashboard", "/students", "/teachers", "/courses", "/classrooms", "/notes", "/reports"],
  teacher: ["/dashboard", "/students", "/courses", "/classrooms", "/notes", "/reports"],
  student: ["/dashboard", "/courses", "/notes"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for authentication token in cookies
  const authToken = request.cookies.get("auth-token")?.value

  // If no auth token, redirect to signin
  if (!authToken) {
    const signinUrl = new URL("/auth/signin", request.url)
    signinUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signinUrl)
  }

  try {
    // Parse the auth token (in real app, you'd verify JWT)
    const userData = JSON.parse(decodeURIComponent(authToken))
    const userRole = userData.role

    // Check role-based access
    const allowedRoutes = roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || []

    // Check if current path starts with any allowed route
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route) || pathname === route)

    if (!hasAccess) {
      // Redirect to dashboard if user doesn't have access to specific route
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If token is invalid, redirect to signin
    const signinUrl = new URL("/auth/signin", request.url)
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
