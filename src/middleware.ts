import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * Single Edge middleware composing two concerns:
 *  - `/api/admin/*`  → the partner's custom admin auth (unchanged, see docs/updates.md)
 *  - everything else the matcher allows → next-intl locale routing
 *
 * Admin auth: a request is authorized only if it carries an `admin_token` cookie
 * whose value matches the SHA-256 hash of ADMIN_PASS (same value set by
 * `POST /api/auth/login`). Missing/invalid tokens get a 401 JSON response.
 * Runs on the Edge runtime, so it uses the Web Crypto API to hash.
 */

const intlMiddleware = createMiddleware(routing);

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin API: the partner's admin-auth check, verbatim.
  if (pathname.startsWith("/api/admin")) {
    const adminPass = process.env.ADMIN_PASS;
    if (!adminPass) {
      // No configured password means no one can be authorized.
      return unauthorized();
    }

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return unauthorized();
    }

    const expected = await sha256Hex(adminPass);
    if (token !== expected) {
      return unauthorized();
    }

    return NextResponse.next();
  }

  // Public localized pages.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Admin API — run admin auth (kept in the matcher; excluded from the intl branch below)
    "/api/admin/:path*",
    // Public pages — exclude non-admin /api, Next internals, /admin, and files with a dot
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ],
};
