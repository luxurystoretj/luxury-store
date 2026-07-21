import { getCategories } from "@/features/categories/api";
import { CategoryBannerForm } from "@/features/category-banners/components/category-banner-form";

export default async function NewCategoryBannerPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Новый баннер
      </h1>
      <CategoryBannerForm categories={categories} />
    </div>
  );
}
