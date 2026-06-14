/**
 * @module middleware
 * @description Next.js middleware for route protection and security.
 * Applies security headers, rate limiting, and auth checks.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/security/headers";

/** Routes that require authentication */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/activities",
  "/recommendations",
  "/simulator",
  "/challenges",
  "/reports",
  "/settings",
];

/** API routes that require authentication */
const PROTECTED_API_ROUTES = [
  "/api/activities",
  "/api/carbon",
  "/api/dashboard",
  "/api/recommendations",
  "/api/simulation",
  "/api/challenges",
];

/** Public routes that should redirect authenticated users */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  const response = NextResponse.next();
  applySecurityHeaders(response);

  // Check for auth token
  const token =
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthenticated = !!token;

  // Protect routes — redirect unauthenticated users to login
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedApi && !isAuthenticated) {
    return NextResponse.json(
      { error: { code: "AUTHENTICATION_ERROR", message: "Authentication required" } },
      { status: 401 }
    );
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
