import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    // If no authorization header is present, or it's not a Basic auth header
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      // Return a response that requires authentication
      return new NextResponse(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      });
    }

    // Decode the Base64 encoded username:password
    const credentials = atob(authHeader.split(" ")[1]);
    const [username, password] = credentials.split(":");

    // Check if the credentials are valid
    // In production, you should use environment variables for these values
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "password";

    if (username !== validUsername || password !== validPassword) {
      // Return a response that requires authentication
      return new NextResponse(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      });
    }
  }

  // Continue with the request if authentication is successful or not required
  return NextResponse.next();
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: "/admin/:path*",
};
