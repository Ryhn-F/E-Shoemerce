import { NextRequest, NextResponse } from "next/server";
import { auth } from "./src/lib/auth/config";

export async function middleware(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Add session info to headers for server components
    const response = NextResponse.next();

    if (session?.user) {
      response.headers.set("x-user-id", session.user.id);
      response.headers.set("x-user-email", session.user.email);
      response.headers.set("x-user-authenticated", "true");
    } else {
      response.headers.set("x-user-authenticated", "false");
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
