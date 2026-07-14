import { CategoryForm } from "@/features/categories/components/category-form";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Новая категория
      </h1>
      <CategoryForm />
    </div>
  );
}
