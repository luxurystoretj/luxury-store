import { notFound } from "next/navigation";

import { adminGetHomepageSections } from "@/features/homepage/api/admin-list";
import { HomepageSectionForm } from "@/features/homepage/components/homepage-section-form";
import { homepageSectionLabel } from "@/features/homepage/lib/section-labels";

type PageProps = { params: Promise<{ sectionKey: string }> };

// No singular admin GET for homepage — fetch all sections and find this one by sectionKey
// (server-only fetcher forwards the admin_token cookie). Unknown key → 404.
export default async function EditHomepageSectionPage({ params }: PageProps) {
  const { sectionKey } = await params;

  const sections = await adminGetHomepageSections();
  const section = sections.find((s) => s.sectionKey === sectionKey);
  if (!section) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        {homepageSectionLabel(section.sectionKey)}
      </h1>
      <HomepageSectionForm section={section} />
    </div>
  );
}
