import { BrandForm } from "@/features/brands/components/brand-form";

export default function NewBrandPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
        Новый бренд
      </h1>
      <BrandForm />
    </div>
  );
}
