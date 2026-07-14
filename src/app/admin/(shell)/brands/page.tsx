import { adminGetBrands } from "@/features/brands/api/admin-list";
import { BrandsTable } from "@/features/brands/components/brands-table";

export default async function AdminBrandsPage() {
  const brands = await adminGetBrands();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Бренды
      </h1>
      <BrandsTable brands={brands} />
    </div>
  );
}
