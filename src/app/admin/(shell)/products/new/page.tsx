import { getBrands } from "@/features/brands/api";
import { getCategories } from "@/features/categories/api";
import { ProductForm } from "@/features/products/components/product-form";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Новый товар
      </h1>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
