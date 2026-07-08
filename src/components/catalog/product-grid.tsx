import { ProductCard } from "@/components/product-card"
import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state"
import type { Product } from "@/features/products/types"
import type { Locale } from "@/lib/locale"

interface ProductGridProps {
  products: Product[]
  locale: Locale
}

// DESIGN §5: 2 / 3 / 4 columns; DESIGN §3: gaps 16 / 24 / 32.
function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return <CatalogEmptyState />
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          priority={index < 4}
        />
      ))}
    </div>
  )
}

export { ProductGrid }
