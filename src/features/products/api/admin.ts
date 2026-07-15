import { apiFetch } from "@/lib/api/client";
import type { Product, ProductDetail, ProductImage } from "@/features/products/types";

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

// --- Product relations ---
// The endpoint creates ONE direction per call and deletes by the relation's own id. Related
// products are symmetric (both PDPs show the pairing), so the picker makes two calls each way
// — see related-products-picker.tsx. 409 (duplicate) on create and 404 (already gone) on
// delete are treated as benign by the caller.
export interface ProductRelationRow {
  id: string;
  productId: string;
  relatedProductId: string;
  createdAt: string;
}

export function adminCreateRelation(payload: {
  productId: string;
  relatedProductId: string;
}): Promise<ProductRelationRow> {
  return apiFetch<ProductRelationRow>("/api/admin/product-relations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteRelation(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/product-relations/${id}`, { method: "DELETE" });
}

// Client-side product-detail fetch (browser auto-forwards the admin_token cookie). Used to
// discover the reverse relation's id on removal — the current product's own data only carries
// its forward relations, and product-relations has no GET to look up a row by pair.
export function adminGetProductClient(id: string): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(`/api/admin/products/${id}`);
}
