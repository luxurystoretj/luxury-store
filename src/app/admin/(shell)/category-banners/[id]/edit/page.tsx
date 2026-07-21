import { notFound } from "next/navigation";

import { getCategories } from "@/features/categories/api";
import { adminGetCategoryBanners } from "@/features/category-banners/api/admin-list";
import { CategoryBannerForm } from "@/features/category-banners/components/category-banner-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCategoryBannerPage({ params }: PageProps) {
  const { id } = await params;
  const [banners, categories] = await Promise.all([
    adminGetCategoryBanners(),
    getCategories(),
  ]);
  const banner = banners.find((b) => b.id === id);
  if (!banner) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Редактировать баннер
      </h1>
      <CategoryBannerForm banner={banner} categories={categories} />
    </div>
  );
}
