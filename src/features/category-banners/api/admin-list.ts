import { adminServerFetch } from "@/lib/api/admin-server-fetch";
import type { CategoryBannerAdmin } from "@/features/category-banners/types";

// Server-only (imports next/headers transitively via adminServerFetch) — only import from
// Server Component pages, never from a "use client" file. No adminGetCategoryBanner(id) —
// mirrors brands/categories: the edit page loads the full list and finds its record by id.
export function adminGetCategoryBanners(): Promise<CategoryBannerAdmin[]> {
  return adminServerFetch<CategoryBannerAdmin[]>("/api/admin/category-banners");
}
