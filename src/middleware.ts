import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * Single Edge middleware composing three concerns:
 *  - `/api/admin/*`  → admin auth for machine clients; missing/invalid token → JSON 401
 *  - `/admin/*`      → admin auth for humans; missing/invalid token → redirect to /admin/login.
 *                      `/admin/login` itself stays public (and, if already authed, bounces to /admin)
 *  - everything else the matcher allows → next-intl locale routing
 *
 * This middleware is the single source of truth for the `admin_token` check
 * (both the API and the page tree). A request is authorized only if it carries
 * an `admin_token` cookie whose value matches the SHA-256 hash of ADMIN_PASS
 * (same value set by `POST /api/auth/login`, see docs/updates.md). Runs on the
 * Edge runtime, so it uses the Web Crypto API to hash.
 */

const intlMiddleware = createMiddleware(routing);

const LOGIN_PATH = "/admin/login";

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 },
  );
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * True only if the request carries a valid `admin_token` cookie. Fail-closed:
 * a missing ADMIN_PASS or a missing/mismatched token all deny.
 */
async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) return false;

  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;

  const expected = await sha256Hex(adminPass);
  return token === expected;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin API: machine clients get a machine-readable 401 on failure (unchanged).
  if (pathname.startsWith("/api/admin")) {
    return (await isAdminAuthorized(request))
      ? NextResponse.next()
      : unauthorized();
  }

  // Admin pages: humans get redirected to the login form on failure.
  if (pathname.startsWith("/admin")) {
    const authorized = await isAdminAuthorized(request);

    // The login page stays publicly reachable so there's a way to sign in.
    // If the visitor is already authed, bounce them to the dashboard; otherwise
    // let the form render. Never redirect the login page to itself (no loop).
    if (pathname === LOGIN_PATH) {
      return authorized
        ? NextResponse.redirect(new URL("/admin", request.url))
        : NextResponse.next();
    }

    // Every other /admin/* page (including the bare /admin dashboard) requires auth.
    return authorized
      ? NextResponse.next()
      : NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // Public localized pages.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Admin API — run admin auth (JSON 401 branch).
    "/api/admin/:path*",
    // Admin pages — run admin auth (redirect branch). `:path*` matches zero or
    // more segments, so this covers the bare `/admin` dashboard root as well as
    // every sub-path (/admin/products, /admin/login, …).
    "/admin/:path*",
    // Public pages — exclude non-admin /api, Next internals, /admin, and files
    // with a dot. (Unchanged: keeps next-intl off admin routes and internals.)
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ],
};
