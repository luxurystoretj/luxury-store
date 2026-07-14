import { apiFetch } from "@/lib/api/client";
import type { Category } from "@/features/categories/types";

export type CategoryWithCount = Category & { _count: { products: number } };

export interface CategoryPayload {
  nameRu: string;
  nameTj: string;
  nameEn: string;
  slug: string;
}

// Admin fetchers hit /api/admin/*, unfiltered and always-fresh (no revalidate caching,
// unlike the public getCategories()). No adminGetCategory(id) — the singular admin route
// only exports PATCH/DELETE, confirmed against src/app/api/admin/categories/[id]/route.ts —
// the edit page finds its record from this list instead.
export function adminGetCategories(): Promise<CategoryWithCount[]> {
  return apiFetch<CategoryWithCount[]>("/api/admin/categories", {
    cache: "no-store",
  });
}

export function adminCreateCategory(payload: CategoryPayload): Promise<Category> {
  return apiFetch<Category>("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminUpdateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
): Promise<Category> {
  return apiFetch<Category>(`/api/admin/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/categories/${id}`, { method: "DELETE" });
}
