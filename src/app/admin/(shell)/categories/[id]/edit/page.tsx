import { notFound } from "next/navigation";

import { adminGetCategories } from "@/features/categories/api/admin-list";
import { CategoryForm } from "@/features/categories/components/category-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categories = await adminGetCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Редактировать категорию
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
