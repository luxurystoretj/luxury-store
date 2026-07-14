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

// Admin fetchers hit /api/admin/*, unfiltered and always-fresh (no revalidate caching,
// unlike the public getBrands()). No adminGetBrand(id) — the singular admin route only
// exports PATCH/DELETE, confirmed against src/app/api/admin/brands/[id]/route.ts — the edit
// page finds its record from this list instead.
export function adminGetBrands(): Promise<BrandWithCount[]> {
  return apiFetch<BrandWithCount[]>("/api/admin/brands", { cache: "no-store" });
}

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
