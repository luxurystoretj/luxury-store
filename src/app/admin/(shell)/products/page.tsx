import { adminGetProducts } from "@/features/products/api/admin-list";
import { ProductsTable } from "@/features/products/components/products-table";

export default async function AdminProductsPage() {
  const products = await adminGetProducts();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Товары
      </h1>
      <ProductsTable products={products} />
    </div>
  );
}
