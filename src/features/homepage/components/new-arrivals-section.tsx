import { getTranslations } from "next-intl/server"

import { ProductCard } from "@/components/product-card"
import { HOME_ROW_SIZE } from "@/features/homepage/lib/constants"
import type { Product } from "@/features/products/types"
import type { Locale } from "@/lib/locale"

interface NewArrivalsSectionProps {
  products: Product[]
  locale: Locale
}

// Products-API-driven (not HomepageSection-backed) — returns null when no
// isNew products exist, heading included in the same gate.
async function NewArrivalsSection({ products, locale }: NewArrivalsSectionProps) {
  const newProducts = products.filter((product) => product.isNew).slice(0, HOME_ROW_SIZE)

  if (newProducts.length === 0) {
    return null
  }

  const t = await getTranslations("Home")

  return (
    <section>
      <h2 className="mb-8 font-display text-2xl">{t("newArrivals.heading")}</h2>
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              priority={index === 0}
              hidePrice
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { NewArrivalsSection }
