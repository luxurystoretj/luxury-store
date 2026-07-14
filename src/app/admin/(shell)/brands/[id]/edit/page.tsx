import { notFound } from "next/navigation";

import { adminGetBrands } from "@/features/brands/api/admin-list";
import { BrandForm } from "@/features/brands/components/brand-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  const brands = await adminGetBrands();
  const brand = brands.find((b) => b.id === id);
  if (!brand) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Редактировать бренд
      </h1>
      <BrandForm brand={brand} />
    </div>
  );
}
