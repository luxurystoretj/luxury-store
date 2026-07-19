import { getTranslations } from "next-intl/server"

import { ProductCard } from "@/components/product-card"
import { HOME_ROW_SIZE } from "@/features/homepage/lib/constants"
import type { Product } from "@/features/products/types"
import type { Locale } from "@/lib/locale"

interface FeaturedSectionProps {
  products: Product[]
  locale: Locale
}

// Products-API-driven (not HomepageSection-backed) — returns null when no
// isFeatured products exist, heading included in the same gate.
async function FeaturedSection({ products, locale }: FeaturedSectionProps) {
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, HOME_ROW_SIZE)

  if (featuredProducts.length === 0) {
    return null
  }

  const t = await getTranslations("Home")

  return (
    <section>
      <h2 className="mb-8 font-display text-2xl">{t("featured.heading")}</h2>
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
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

export { FeaturedSection }
