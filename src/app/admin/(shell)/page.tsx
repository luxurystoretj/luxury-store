import { getBrands } from "@/features/brands/api";
import { getCategories } from "@/features/categories/api";
import { getHomepageSections } from "@/features/homepage/api";
import { getProducts } from "@/features/products/api";

// Admin landing page. Public list endpoints filter isActive=true for products
// and homepage sections; there are no admin GET/list endpoints yet, so labels
// name the filter honestly (see partner report). Brands and categories return
// all rows.

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="border border-border-default bg-background p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        {label}
      </p>
      <p className="mt-4 font-[family-name:var(--font-body)] text-4xl font-medium text-foreground [font-variant-numeric:tabular-nums]">
        {value}
      </p>
    </div>
  );
}

type SectionStatus = "ready" | "soon";

const SECTION_STATUS: readonly {
  label: string;
  href: string;
  status: SectionStatus;
}[] = [
  { label: "Дашборд", href: "/admin", status: "ready" },
  { label: "Товары", href: "/admin/products", status: "ready" },
  { label: "Бренды", href: "/admin/brands", status: "ready" },
  { label: "Категории", href: "/admin/categories", status: "ready" },
  { label: "Главная", href: "/admin/homepage", status: "ready" },
];

export default async function AdminDashboardPage() {
  const [products, brands, categories, sections] = await Promise.all([
    getProducts({}),
    getBrands(),
    getCategories(),
    getHomepageSections(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground">
          Дашборд
        </h1>
        <p className="max-w-[640px] text-sm text-foreground">
          Обзор каталога. Управление товарами, брендами, категориями и
          главной страницей доступно в боковой панели.
        </p>
      </header>

      <section aria-labelledby="admin-stats-heading">
        <h2 id="admin-stats-heading" className="sr-only">
          Показатели каталога
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <StatCard label="Активных товаров" value={products.length} />
          <StatCard label="Брендов" value={brands.length} />
          <StatCard label="Категорий" value={categories.length} />
          <StatCard
            label="Активных секций главной"
            value={sections.length}
          />
        </div>
      </section>

      <section aria-labelledby="admin-status-heading" className="max-w-[640px]">
        <h2
          id="admin-status-heading"
          className="font-[family-name:var(--font-display)] text-xl font-normal text-foreground"
        >
          Что доступно
        </h2>
        <ul className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
          {SECTION_STATUS.map((item) => (
            <li
              key={item.href}
              className="flex items-center justify-between py-3"
            >
              <span className="text-sm text-foreground">{item.label}</span>
              <span
                className={
                  item.status === "ready"
                    ? "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--success)]"
                    : "text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground"
                }
              >
                {item.status === "ready" ? "Готово" : "Скоро"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
