import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req: req });
  const url = req.nextUrl;

  if (
    token &&
    (url.pathname === "/signin" ||
      url.pathname === "/signup" ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (
    !token &&
    (url.pathname.startsWith("/feed/") ||
      url.pathname.startsWith("/question/") ||
      url.pathname.startsWith("/profile/") ||
      url.pathname.startsWith("/notification"))
  ) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
};

// Apply middleware to these paths
// the config.matcher field tells Next.js which routes should run this middleware
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/",
    "/feed",
    "/feed/:path*",
    "/question/:path*",
    "/profile/:path*",
    "/notification",
    "/admin/:path*",
    "/search/:path*",
  ],
};
