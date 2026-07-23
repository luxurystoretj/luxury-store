import { getTranslations } from "next-intl/server"
import { FilterFields } from "@/components/catalog/filter-fields"
import { SortControl } from "@/components/catalog/sort-control"
import type { Brand } from "@/features/brands/types"
import type { Category } from "@/features/categories/types"

interface FilterToolbarProps {
  brands: Brand[]
  categories: Category[]
  sizes: string[]
}

// Desktop only — a horizontal bar above the grid, not a sidebar. DESIGN §5's
// grid-column table assumes full container width; a persistent w-64 sidebar
// would squeeze the mandated 4-column grid to ~136px/column right at the `lg`
// breakpoint (1024px, 928px content width) versus ~208px with no sidebar.
// Sort sits on this same row, pushed to the far right via ml-auto — a
// distinct control (ordering, not narrowing), separated from the filter
// group by that gap rather than blended in with it. Mobile keeps its own
// separate sort instance next to the filter-sheet trigger (catalog page).
async function FilterToolbar({ brands, categories, sizes }: FilterToolbarProps) {
  const t = await getTranslations("Catalog.sort")

  return (
    <div className="mb-6 hidden border-b border-border-subtle pb-6 lg:flex lg:items-start lg:gap-6">
      <FilterFields brands={brands} categories={categories} sizes={sizes} showReset />
      <div className="ml-auto flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
          {t("heading")}
        </label>
        <SortControl />
      </div>
    </div>
  )
}

export { FilterToolbar }
