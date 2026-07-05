import { apiFetch } from "@/lib/api/client";
import type { HomepageSection } from "@/features/homepage/types";

// Hero/promo copy is actively being iterated on right now — kept short deliberately.
const HOMEPAGE_REVALIDATE_SECONDS = 60;

export function getHomepageSections(): Promise<HomepageSection[]> {
  return apiFetch<HomepageSection[]>("/api/homepage", {
    next: { revalidate: HOMEPAGE_REVALIDATE_SECONDS },
  });
}
