import { adminGetCategoryBanners } from "@/features/category-banners/api/admin-list";
import { CategoryBannersTable } from "@/features/category-banners/components/category-banners-table";

export default async function AdminCategoryBannersPage() {
  const banners = await adminGetCategoryBanners();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Баннеры категорий
      </h1>
      <CategoryBannersTable banners={banners} />
    </div>
  );
}
