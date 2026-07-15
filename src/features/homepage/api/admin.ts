import { apiFetch } from "@/lib/api/client";
import type { HomepageSection } from "@/features/homepage/types";

// PATCH /api/admin/homepage identifies the section by sectionKey (or id) in the body and does a
// partial update. There is no create/delete — the section set is fixed (hero/about/contacts).
// Runs client-side from the form; the browser forwards the admin_token cookie automatically.
export interface HomepageSectionPayload {
  sectionKey: string;
  titleRu: string | null;
  titleTj: string | null;
  titleEn: string | null;
  subtitleRu: string | null;
  subtitleTj: string | null;
  subtitleEn: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
}

export function adminUpdateHomepageSection(
  payload: HomepageSectionPayload,
): Promise<HomepageSection> {
  return apiFetch<HomepageSection>("/api/admin/homepage", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
