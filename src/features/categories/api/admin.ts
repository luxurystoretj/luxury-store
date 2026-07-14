import { apiFetch } from "@/lib/api/client";
import type { Category } from "@/features/categories/types";

export type CategoryWithCount = Category & { _count: { products: number } };

export interface CategoryPayload {
  nameRu: string;
  nameTj: string;
  nameEn: string;
  slug: string;
}

// GET fetchers live in ./admin-list.ts (server-only — they need to forward the admin_token
// cookie, which only works via next/headers). This file holds the mutation functions, which
// run client-side from *-table.tsx/*-form.tsx and rely on the browser's own automatic
// same-origin cookie forwarding, so they stay plain apiFetch with no special handling.

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
