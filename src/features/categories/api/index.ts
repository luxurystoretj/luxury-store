import { apiFetch } from "@/lib/api/client";
import type { Category } from "@/features/categories/types";

// Category content is actively being populated right now — kept short deliberately.
// TODO: raise toward 30–60 min once category content is finalized post-launch.
const CATEGORIES_REVALIDATE_SECONDS = 60;

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories", {
    next: { revalidate: CATEGORIES_REVALIDATE_SECONDS },
  });
}
