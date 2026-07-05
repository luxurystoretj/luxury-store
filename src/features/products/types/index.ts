import type { Brand } from "@/features/brands/types";
import type { Category } from "@/features/categories/types";

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  imageKey: string | null;
  blurDataURL: string | null;
  altRu: string | null;
  altTj: string | null;
  altEn: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  createdAt: string;
}

export interface Product {
  id: string;
  nameRu: string;
  nameTj: string;
  nameEn: string;
  slug: string;
  descriptionRu: string | null;
  descriptionTj: string | null;
  descriptionEn: string | null;
  compositionRu: string | null;
  compositionTj: string | null;
  compositionEn: string | null;
  colorRu: string | null;
  colorTj: string | null;
  colorEn: string | null;
  priceTjs: string;
  priceUsd: string;
  brandId: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  // GET /api/products filters this to quantity > 0 only; GET /api/products/[slug]
  // returns all sizes (including out-of-stock) so the UI can render them as unavailable.
  sizes: ProductSize[];
  images: ProductImage[];
}

// No `brand` — API's relatedProduct select doesn't include it; open question to
// the backend partner, unresolved as of Phase 2 (see TASKS.md / partner report).
export interface RelatedProduct {
  id: string;
  nameRu: string;
  nameTj: string;
  nameEn: string;
  slug: string;
  priceTjs: string;
  priceUsd: string;
  images: ProductImage[];
}

export interface RelatedProductLink {
  id: string;
  productId: string;
  relatedProductId: string;
  createdAt: string;
  relatedProduct: RelatedProduct;
}

export interface ProductDetail extends Product {
  relatedFrom: RelatedProductLink[];
}
