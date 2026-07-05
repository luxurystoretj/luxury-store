import { apiFetch, ApiError } from "@/lib/api/client";
import type { Product, ProductDetail } from "@/features/products/types";

const PRODUCTS_REVALIDATE_SECONDS = 60;

export interface ProductListParams {
  search?: string;
  brand?: string;
  category?: string;
  color?: string;
  size?: string;
  sort?: "new" | "price_asc" | "price_desc";
}

export function getProducts(params?: ProductListParams): Promise<Product[]> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) query.set(key, value);
  }
  const queryString = query.toString();

  return apiFetch<Product[]>(`/api/products${queryString ? `?${queryString}` : ""}`, {
    next: { revalidate: PRODUCTS_REVALIDATE_SECONDS },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    return await apiFetch<ProductDetail>(`/api/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: PRODUCTS_REVALIDATE_SECONDS },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
