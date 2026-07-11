import { getTranslations } from "next-intl/server"

import { BrandCard } from "@/features/brands/components/brand-card"
import type { Brand } from "@/features/brands/types"
import type { Locale } from "@/lib/locale"

interface BrandGridProps {
  brands: Brand[]
  locale: Locale
}

// 3-column cap (not the product grid's 4) — brand cards carry more content
// per card (logo + name + description) than a product card's brand/name/price.
async function BrandGrid({ brands, locale }: BrandGridProps) {
  if (brands.length === 0) {
    const t = await getTranslations("Brands")
    return <p className="text-foreground">{t("empty")}</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-8">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} locale={locale} />
      ))}
    </div>
  )
}

export { BrandGrid }
