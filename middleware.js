import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Array of paths that require authentication
const protectedPaths = ["/dashboard", "/account"];

// Array of paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/register", "/forgot", "/reset-password"];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token");

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((prefix) =>
    path.startsWith(prefix)
  );
  const isAuthPath = authPaths.some((prefix) => path.startsWith(prefix));

  try {
    if (!token && isProtectedPath) {
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
      await jwtVerify(token.value, secret);

      if (isAuthPath) {
        // Redirect to dashboard if trying to access auth routes while logged in
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token verification fails, clear the invalid token and redirect to login
    if (isProtectedPath) {
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
