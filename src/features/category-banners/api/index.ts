import { apiFetch } from "@/lib/api/client";
import type { CategoryBannerPublic } from "@/features/category-banners/types";

// Few banners, changed rarely — same revalidate window as brands/categories/homepage.
const CATEGORY_BANNERS_REVALIDATE_SECONDS = 60;

export function getCategoryBanners(): Promise<CategoryBannerPublic[]> {
  return apiFetch<CategoryBannerPublic[]>("/api/category-banners", {
    next: { revalidate: CATEGORY_BANNERS_REVALIDATE_SECONDS },
  });
}
