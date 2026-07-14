import { apiFetch } from "@/lib/api/client";
import type { Brand } from "@/features/brands/types";

export type BrandWithCount = Brand & { _count: { products: number } };

export interface BrandPayload {
  name: string;
  slug: string;
  descriptionRu: string | null;
  descriptionTj: string | null;
  descriptionEn: string | null;
  logoUrl: string | null;
}

// GET fetchers live in ./admin-list.ts (server-only — they need to forward the admin_token
// cookie, which only works via next/headers). This file holds the mutation functions, which
// run client-side from *-table.tsx/*-form.tsx and rely on the browser's own automatic
// same-origin cookie forwarding, so they stay plain apiFetch with no special handling.

export function adminCreateBrand(
  payload: Pick<BrandPayload, "name" | "slug"> & Partial<BrandPayload>,
): Promise<Brand> {
  return apiFetch<Brand>("/api/admin/brands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminUpdateBrand(
  id: string,
  payload: Partial<BrandPayload>,
): Promise<Brand> {
  return apiFetch<Brand>(`/api/admin/brands/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteBrand(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/brands/${id}`, { method: "DELETE" });
}
