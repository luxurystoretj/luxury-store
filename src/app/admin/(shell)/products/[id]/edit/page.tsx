import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { getBrands } from "@/features/brands/api";
import { getCategories } from "@/features/categories/api";
import { adminGetProduct } from "@/features/products/api/admin";
import { ProductForm } from "@/features/products/components/product-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await adminGetProduct(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Редактировать товар
      </h1>
      <ProductForm product={product} brands={brands} categories={categories} />
    </div>
  );
}
