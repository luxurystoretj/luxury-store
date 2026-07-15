import { apiFetch } from "@/lib/api/client";
import type { Product, ProductImage } from "@/features/products/types";

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

// GET fetchers live in ./admin-list.ts (server-only — they need to forward the admin_token
// cookie, which only works via next/headers). This file holds the mutation functions, which
// run client-side from products-table.tsx/product-form.tsx and rely on the browser's own
// automatic same-origin cookie forwarding, so they stay plain apiFetch with no special
// handling.

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

// --- Product images ---
// POST /api/admin/product-images is multipart/form-data (fields: file, productId, optional
// sortOrder + altRu/altTj/altEn). Do NOT set Content-Type — the browser adds the multipart
// boundary itself. The endpoint has no PATCH/GET, so images are add + delete only (no
// reorder / alt-edit without a backend change).
export function adminUploadProductImage(formData: FormData): Promise<ProductImage> {
  return apiFetch<ProductImage>("/api/admin/product-images", {
    method: "POST",
    body: formData,
  });
}

export function adminDeleteProductImage(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/product-images/${id}`, { method: "DELETE" });
}
