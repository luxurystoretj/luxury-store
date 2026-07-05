import { apiFetch } from "@/lib/api/client";
import type { Brand } from "@/features/brands/types";

// Brand content is actively being populated right now — kept short deliberately.
// TODO: raise toward 30–60 min once brand content is finalized post-launch.
const BRANDS_REVALIDATE_SECONDS = 60;

export function getBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>("/api/brands", {
    next: { revalidate: BRANDS_REVALIDATE_SECONDS },
  });
}
