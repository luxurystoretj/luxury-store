import { getTranslations, setRequestLocale } from "next-intl/server"
import { Container } from "@/components/layout/container"
import { CatalogParamsProvider } from "@/components/catalog/catalog-params-provider"
import { CatalogGridSlot } from "@/components/catalog/catalog-grid-slot"
import { FilterToolbar } from "@/components/catalog/filter-toolbar"
import { MobileFilterSheet } from "@/components/catalog/mobile-filter-sheet"
import { ProductGrid } from "@/components/catalog/product-grid"
import { SearchInput } from "@/components/catalog/search-input"
import { SortControl } from "@/components/catalog/sort-control"
import { getBrands } from "@/features/brands/api"
import { getCategories } from "@/features/categories/api"
import { getProducts } from "@/features/products/api"
import { deriveSizes } from "@/features/products/lib/derive-sizes"
import { parseProductListParams } from "@/features/products/lib/parse-list-params"
import type { Locale } from "@/lib/locale"

interface CatalogPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const sp = await searchParams
  const listParams = parseProductListParams((key) => {
    const value = sp[key]
    return Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
  })

  // Size facet options are derived from the whole catalog (an extra unfiltered
  // fetch), not the currently-filtered set, so the size list doesn't shrink as
  // other filters are applied — deliberate simplification, no real per-facet
  // counting for this MVP.
  const [products, brands, categories, allProducts] = await Promise.all([
    getProducts(listParams),
    getBrands(),
    getCategories(),
    getProducts({}),
  ])
  const sizes = deriveSizes(allProducts)
  const t = await getTranslations("Catalog")

  return (
    <Container className="py-8 md:py-12">
      <CatalogParamsProvider>
        <h1 className="mb-8 font-display text-3xl">{t("title")}</h1>
        <div className="mb-6">
          <SearchInput />
        </div>
        <FilterToolbar brands={brands} categories={categories} sizes={sizes} />
        <div className="mb-6 flex items-center gap-3">
          <MobileFilterSheet brands={brands} categories={categories} sizes={sizes} />
          <div className="flex-1" />
          <SortControl />
        </div>
        <CatalogGridSlot>
          <ProductGrid products={products} locale={locale as Locale} />
        </CatalogGridSlot>
      </CatalogParamsProvider>
    </Container>
  )
}
