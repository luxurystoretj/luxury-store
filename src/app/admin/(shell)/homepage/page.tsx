import { adminGetHomepageSections } from "@/features/homepage/api/admin-list";
import { HomepageSectionsTable } from "@/features/homepage/components/homepage-sections-table";

export default async function AdminHomepagePage() {
  const sections = await adminGetHomepageSections();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Главная
      </h1>
      <HomepageSectionsTable sections={sections} />
    </div>
  );
}
