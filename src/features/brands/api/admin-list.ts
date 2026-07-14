import { adminServerFetch } from "@/lib/api/admin-server-fetch";
import type { BrandWithCount } from "@/features/brands/api/admin";

// Server-only (imports next/headers transitively via adminServerFetch) — only import from
// Server Component pages, never from a "use client" file. No adminGetBrand(id) — the
// singular admin route only exports PATCH/DELETE, confirmed against
// src/app/api/admin/brands/[id]/route.ts — the edit page finds its record from this list
// instead.
export function adminGetBrands(): Promise<BrandWithCount[]> {
  return adminServerFetch<BrandWithCount[]>("/api/admin/brands");
}
