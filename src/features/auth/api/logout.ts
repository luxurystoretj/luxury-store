"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Clears the admin_token cookie and returns to the login screen.
 *
 * Server Action rather than a POST /api/auth/logout route: no new API surface
 * is needed for a one-line cookie delete, and Next's cookies().delete(...) is
 * the documented pattern for this. Session 1 has no plans for external
 * (non-browser) logout callers; if that changes, promoting this to an explicit
 * endpoint is trivial.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
