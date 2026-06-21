import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects all `/api/admin/*` routes (custom admin auth, see docs/updates.md).
 *
 * A request is authorized only if it carries an `admin_token` cookie whose
 * value matches the SHA-256 hash of ADMIN_PASS (the same value set by
 * `POST /api/auth/login`). Missing or invalid tokens get a 401 JSON response.
 *
 * Runs on the Edge runtime, so it uses the Web Crypto API to hash.
 */

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

export const config = {
  matcher: ["/api/admin/:path*"],
};
