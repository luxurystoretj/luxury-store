import { adminServerFetch } from "@/lib/api/admin-server-fetch";
import type { CategoryWithCount } from "@/features/categories/api/admin";

// Server-only (imports next/headers transitively via adminServerFetch) — only import from
// Server Component pages, never from a "use client" file. No adminGetCategory(id) — the
// singular admin route only exports PATCH/DELETE, confirmed against
// src/app/api/admin/categories/[id]/route.ts — the edit page finds its record from this
// list instead.
export function adminGetCategories(): Promise<CategoryWithCount[]> {
  return adminServerFetch<CategoryWithCount[]>("/api/admin/categories");
}
