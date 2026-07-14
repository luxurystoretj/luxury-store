import { adminGetCategories } from "@/features/categories/api/admin-list";
import { CategoriesTable } from "@/features/categories/components/categories-table";

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Категории
      </h1>
      <CategoriesTable categories={categories} />
    </div>
  );
}
