import { FilterFields } from "@/components/catalog/filter-fields"
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
function FilterToolbar({ brands, categories, sizes }: FilterToolbarProps) {
  return (
    <div className="mb-6 hidden border-b border-border-subtle pb-6 lg:block">
      <FilterFields brands={brands} categories={categories} sizes={sizes} showReset />
    </div>
  )
}

export { FilterToolbar }
