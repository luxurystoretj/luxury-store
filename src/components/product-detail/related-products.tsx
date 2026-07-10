import { getTranslations } from "next-intl/server"

import { RelatedProductCard } from "@/components/product-detail/related-product-card"
import type { RelatedProductLink } from "@/features/products/types"
import type { Locale } from "@/lib/locale"

interface RelatedProductsProps {
  relatedFrom: RelatedProductLink[]
  locale: Locale
}

// Hidden entirely (not an empty state) when relatedFrom is empty — the mt-8
// rhythm lives here, not on a page.tsx wrapper, so nothing renders at all.
async function RelatedProducts({ relatedFrom, locale }: RelatedProductsProps) {
  if (relatedFrom.length === 0) {
    return null
  }

  const t = await getTranslations("Product")

  return (
    <section className="mt-8">
      <h2 className="mb-8 font-display text-2xl">{t("related.heading")}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {relatedFrom.map((link) => (
          <RelatedProductCard key={link.id} product={link.relatedProduct} locale={locale} />
        ))}
      </div>
    </section>
  )
}

export { RelatedProducts }
