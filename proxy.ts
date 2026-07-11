/**
 * proxy.ts
 * Route guard — redirects unauthenticated users to /login
 * and enforces role-based access to dashboard sections.
 *
 * NOTE: NextAuth v5 auth() runs in Node.js runtime.
 * We do a lightweight JWT check here using next-auth's getToken.
 */

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROLE_PATHS: Record<string, string> = {
  SURVEILLANT: "/dashboard/surveillant",
  TEACHER: "/dashboard/teacher",
  STUDENT: "/dashboard/student",
};

const PUBLIC_PATHS = ["/login", "/register", "/api/auth", "/"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Always allow public paths
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Get JWT token without needing full auth() (edge-safe)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  // /dashboard root → redirect to role-specific dashboard
  if (path === "/dashboard" || path === "/dashboard/") {
    const target = role ? (ROLE_PATHS[role] ?? "/login") : "/login";
    return NextResponse.redirect(new URL(target, req.nextUrl.origin));
  }

  // Role-based path protection
  if (path.startsWith("/dashboard/surveillant") && role !== "SURVEILLANT") {
    return NextResponse.redirect(
      new URL(
        role ? (ROLE_PATHS[role] ?? "/login") : "/login",
        req.nextUrl.origin,
      ),
    );
  }
  if (path.startsWith("/dashboard/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(
      new URL(
        role ? (ROLE_PATHS[role] ?? "/login") : "/login",
        req.nextUrl.origin,
      ),
    );
  }
  if (path.startsWith("/dashboard/student") && role !== "STUDENT") {
    return NextResponse.redirect(
      new URL(
        role ? (ROLE_PATHS[role] ?? "/login") : "/login",
        req.nextUrl.origin,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
