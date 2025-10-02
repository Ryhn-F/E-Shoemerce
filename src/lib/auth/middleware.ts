import { NextRequest, NextResponse } from "next/server";
import { auth } from "./config";

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protected routes that require authentication
  const protectedRoutes = ["/checkout", "/profile", "/orders"];
  const authRoutes = ["/sign-in", "/sign-up"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session?.user) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session?.user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Helper function to check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return !!session?.user;
  } catch {
    return false;
  }
}
