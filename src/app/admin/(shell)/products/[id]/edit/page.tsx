import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { getBrands } from "@/features/brands/api";
import { getCategories } from "@/features/categories/api";
import { adminGetProduct, adminGetProducts } from "@/features/products/api/admin-list";
import { ProductForm } from "@/features/products/components/product-form";
import { ImagesEditor } from "@/features/products/components/images-editor";
import { RelatedProductsPicker } from "@/features/products/components/related-products-picker";

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

  const [brands, categories, allProducts] = await Promise.all([
    getBrands(),
    getCategories(),
    adminGetProducts(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Редактировать товар
      </h1>
      <ProductForm product={product} brands={brands} categories={categories} />

      <div className="max-w-2xl border-t border-border-subtle" />

      <ImagesEditor
        productId={product.id}
        initialImages={product.images}
        productName={product.nameRu}
      />

      <div className="max-w-2xl border-t border-border-subtle" />

      <RelatedProductsPicker
        productId={product.id}
        initialLinks={product.relatedFrom}
        candidates={allProducts}
      />
    </div>
  );
}
