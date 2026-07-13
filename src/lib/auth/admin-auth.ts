import { createHash } from "node:crypto";

import { cookies } from "next/headers";

/**
 * Server-side check for admin authentication in the /admin page tree.
 *
 * The middleware guards `/api/admin/*` using the same rule (Edge runtime, Web
 * Crypto). This helper repeats that rule in Node — server components under
 * `/admin` need the check too, since the middleware matcher explicitly excludes
 * `/admin` pages. The small duplication is intentional (see docs/updates.md
 * "Auth Decision: Custom Cookie-based Admin Auth").
 *
 * Never expose to a Client Component — importing `next/headers` from one throws.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) return false;

  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  const expected = createHash("sha256").update(adminPass).digest("hex");
  return token === expected;
}
