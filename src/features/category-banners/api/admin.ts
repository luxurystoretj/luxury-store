import { apiFetch } from "@/lib/api/client";
import type { CategoryBannerAdmin } from "@/features/category-banners/types";

// GET fetchers live in ./admin-list.ts (server-only — see that file for why). This file
// holds the mutation functions, which run client-side from *-table.tsx/*-form.tsx and rely
// on the browser's own automatic same-origin cookie forwarding, so they stay plain apiFetch.
//
// Both create and update are multipart/form-data (image upload to R2), never JSON — mirrors
// POST /api/admin/product-images. Do NOT set Content-Type on these requests: the browser
// adds the multipart boundary itself.

export function adminCreateCategoryBanner(formData: FormData): Promise<CategoryBannerAdmin> {
  return apiFetch<CategoryBannerAdmin>("/api/admin/category-banners", {
    method: "POST",
    body: formData,
  });
}

export function adminUpdateCategoryBanner(
  id: string,
  formData: FormData,
): Promise<CategoryBannerAdmin> {
  return apiFetch<CategoryBannerAdmin>(`/api/admin/category-banners/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export function adminDeleteCategoryBanner(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/category-banners/${id}`, { method: "DELETE" });
}
