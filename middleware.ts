import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;
const EXCLUDE_PATHS = ["/_next", "/api", "/favicon.ico", "/robots.txt", "/manifest.webmanifest", "/images"];

const DEFAULT_SLUG = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (EXCLUDE_PATHS.some((prefix) => pathname.startsWith(prefix)) || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return NextResponse.next();
  }

  // Expect pattern /store/:slug/... ; store slug and continue without rewrite
  if (segments[0] === "store" && segments[1]) {
    const tenantSlug = segments[1];
    const res = NextResponse.next();
    res.headers.set("x-tenant-slug", tenantSlug);
    res.cookies.set("tenant-slug", tenantSlug, { path: "/" });
    return res;
  }

  // If a default slug is configured, redirect root or non-store paths into /store/:slug/...
  if (DEFAULT_SLUG) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/store/${DEFAULT_SLUG}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
