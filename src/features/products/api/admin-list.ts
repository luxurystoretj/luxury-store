import { adminServerFetch } from "@/lib/api/admin-server-fetch";
import type { Product, ProductDetail } from "@/features/products/types";

// Server-only (imports next/headers transitively via adminServerFetch) — only import from
// Server Component pages, never from a "use client" file. Unlike brands/categories, a
// singular admin GET does exist here (GET /api/admin/products/:id), confirmed against
// src/app/api/admin/products/[id]/route.ts — used directly by the edit page, which still
// catches ApiError with status 404 to call notFound().
export function adminGetProducts(): Promise<Product[]> {
  return adminServerFetch<Product[]>("/api/admin/products");
}

// Returns ProductDetail: GET /api/admin/products/:id includes relatedFrom (→ relatedProduct)
// and all images, which the edit page needs to prefill the images editor and related picker.
export function adminGetProduct(id: string): Promise<ProductDetail> {
  return adminServerFetch<ProductDetail>(`/api/admin/products/${id}`);
}
