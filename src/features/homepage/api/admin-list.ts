import { adminServerFetch } from "@/lib/api/admin-server-fetch";
import type { HomepageSection } from "@/features/homepage/types";

// Server-only (imports next/headers transitively via adminServerFetch) — only import from
// Server Component pages, never from a "use client" file. GET /api/admin/homepage returns ALL
// sections (no isActive filter). There is no singular admin GET, so the edit page fetches all
// and finds its section by sectionKey (like brands/categories).
export function adminGetHomepageSections(): Promise<HomepageSection[]> {
  return adminServerFetch<HomepageSection[]>("/api/admin/homepage");
}
