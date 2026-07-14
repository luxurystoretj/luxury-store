import { cookies } from "next/headers";

import { apiFetch } from "@/lib/api/client";

// Server Components fetching /api/admin/* need to forward the incoming request's
// admin_token cookie explicitly — a server-side fetch() to the app's own API is a brand
// new HTTP request and does NOT automatically carry the original browser cookie the way a
// client-side fetch does. Without this, src/middleware.ts's admin_token check rejects every
// admin GET with 401, even for a legitimately authenticated admin (confirmed live: edit
// pages returned 401 instead of the expected DB error before this fix). Only ever import
// this from Server Components/pages, never from a "use client" file.
export async function adminServerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  return apiFetch<T>(path, {
    ...init,
    cache: "no-store",
    headers: { ...init?.headers, cookie: cookieHeader },
  });
}
