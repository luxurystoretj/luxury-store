import { apiFetch } from "@/lib/api/client";
import type { Product } from "@/features/products/types";

export interface SizePayload {
  size: string;
  quantity: number;
}

export interface ProductPayload {
  nameRu: string;
  nameTj: string;
  nameEn: string;
  slug: string;
  brandId: string;
  categoryId: string;
  priceTjs: number;
  priceUsd: number;
  descriptionRu: string | null;
  descriptionTj: string | null;
  descriptionEn: string | null;
  compositionRu: string | null;
  compositionTj: string | null;
  compositionEn: string | null;
  colorRu: string | null;
  colorTj: string | null;
  colorEn: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sizes: SizePayload[];
}

// Admin fetchers hit /api/admin/*, unfiltered and always-fresh (no revalidate caching,
// unlike the public getProducts()). Unlike brands/categories, a singular admin GET does
// exist here (GET /api/admin/products/:id), confirmed against
// src/app/api/admin/products/[id]/route.ts — used directly by the edit page.
export function adminGetProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/admin/products", { cache: "no-store" });
}

export function adminGetProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/admin/products/${id}`, { cache: "no-store" });
}

export function adminCreateProduct(payload: ProductPayload): Promise<Product> {
  return apiFetch<Product>("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminUpdateProduct(
  id: string,
  payload: Partial<ProductPayload>,
): Promise<Product> {
  return apiFetch<Product>(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Soft delete (sets isActive:false server-side) — reversible via the edit form's
// isActive Switch, confirmed against src/app/api/admin/products/[id]/route.ts DELETE.
export function adminDeleteProduct(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/products/${id}`, { method: "DELETE" });
}
