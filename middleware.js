import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Array of paths that require authentication
const protectedPaths = ["/dashboard", "/account", "/create"];

// Array of paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/register", "/forgot", "/reset-password"];

// Array of paths that require admin role
const adminPaths = ["/admin-dashboard"];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token");

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((prefix) =>
    path.startsWith(prefix)
  );
  const isAuthPath = authPaths.some((prefix) => path.startsWith(prefix));
  const isAdminPath = adminPaths.some((prefix) => path.startsWith(prefix));

  try {
    if (!token && (isProtectedPath || isAdminPath)) {
      // Redirect to login if trying to access protected route without token
      const url = new URL("/login", request.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }

    if (token) {
      // Verify token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key"
      );
      const decoded = await jwtVerify(token.value, secret);

      // Check for admin paths
      if (isAdminPath && decoded.payload.role !== "admin") {
        // Redirect non-admin users to regular dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Allow admin users to access any user's dashboard
      if (path === "/dashboard" && request.nextUrl.searchParams.has("userId")) {
        if (decoded.payload.role !== "admin") {
          // Redirect non-admin users to their own dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Allow admin to continue to the user's dashboard
        return NextResponse.next();
      }

      // Redirect admin users to admin dashboard when accessing root dashboard
      if (
        path === "/dashboard" &&
        !request.nextUrl.searchParams.has("userId") &&
        decoded.payload.role === "admin"
      ) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }

      if (isAuthPath) {
        // Redirect to appropriate dashboard based on role
        const dashboardUrl =
          decoded.payload.role === "admin" ? "/admin-dashboard" : "/dashboard";
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token verification fails, clear the invalid token and redirect to login
    if (isProtectedPath || isAdminPath) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
    return NextResponse.next();
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
