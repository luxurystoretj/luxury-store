import { createHash } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/login
 *
 * Minimal custom admin auth for the MVP (see docs/updates.md).
 * Validates the submitted password against the ADMIN_PASS env variable and,
 * on success, sets an HTTP-only cookie `admin_token` valid for 24 hours.
 *
 * The cookie value is a SHA-256 hash of ADMIN_PASS (never the raw password),
 * which the middleware recomputes to authorize `/api/admin/*` requests.
 */

const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export async function POST(request: Request) {
  try {
    const adminPass = process.env.ADMIN_PASS;

    // Fail safe: without a configured password, no login is possible.
    if (!adminPass) {
      console.error("POST /api/auth/login: ADMIN_PASS is not configured.");
      return NextResponse.json(
        { success: false, message: "Server is not configured for admin login." },
        { status: 500 },
      );
    }

    let password: unknown;
    try {
      const body = await request.json();
      password = body?.password;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 },
      );
    }

    if (typeof password !== "string" || password !== adminPass) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 },
      );
    }

    const token = createHash("sha256").update(adminPass).digest("hex");

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      // Secure cookies require HTTPS; disable only for local development.
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 },
    );
  }
}
