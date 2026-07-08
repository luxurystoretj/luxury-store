import { getTranslations, setRequestLocale } from "next-intl/server"
import { Container } from "@/components/layout/container"
import { CatalogParamsProvider } from "@/components/catalog/catalog-params-provider"
import { CatalogGridSlot } from "@/components/catalog/catalog-grid-slot"
import { ProductGrid } from "@/components/catalog/product-grid"
import { SortControl } from "@/components/catalog/sort-control"
import { getProducts } from "@/features/products/api"
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

  const products = await getProducts(listParams)
  const t = await getTranslations("Catalog")

  return (
    <Container className="py-8 md:py-12">
      <CatalogParamsProvider>
        <h1 className="mb-8 font-display text-3xl">{t("title")}</h1>
        <div className="mb-6 flex items-center justify-end">
          <SortControl />
        </div>
        <CatalogGridSlot>
          <ProductGrid products={products} locale={locale as Locale} />
        </CatalogGridSlot>
      </CatalogParamsProvider>
    </Container>
  )
}
