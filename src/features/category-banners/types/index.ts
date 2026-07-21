import type { Category } from "@/features/categories/types";

export interface CategoryBanner {
  id: string;
  imageUrl: string;
  imageKey: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Public GET /api/category-banners trims the linked category to just what the
// homepage slide needs: the catalog-link slug and trilingual name (used as the
// image's alt-text fallback — banners carry no alt of their own).
export interface CategoryBannerCategorySummary {
  slug: string;
  nameRu: string;
  nameTj: string;
  nameEn: string;
}

export interface CategoryBannerPublic extends CategoryBanner {
  category: CategoryBannerCategorySummary;
}

// Admin GET /api/admin/category-banners includes the full linked category.
export interface CategoryBannerAdmin extends CategoryBanner {
  category: Category;
}
