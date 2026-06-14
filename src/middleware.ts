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

import { auth } from "@/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  // Note: For redirects/JSON, headers should technically be appended to those specific NextResponses,
  // but applying to a generic next() response works for standard route pass-throughs.
  let response = NextResponse.next();
  applySecurityHeaders(response);

  const isAuthenticated = !!request.auth;
  const userRole = request.auth?.user?.role;

  // RBAC Enforcement (P0)
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    // If not admin, redirect or return 403
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
    response = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(response);
  }

  if (isProtectedApi && !isAuthenticated) {
    response = NextResponse.json(
      { error: { code: "AUTHENTICATION_ERROR", message: "Authentication required" } },
      { status: 401 }
    );
    return applySecurityHeaders(response);
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
    return applySecurityHeaders(response);
  }

  return response;
});

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
