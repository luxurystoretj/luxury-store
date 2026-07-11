import Image from "next/image"

import { Link } from "@/i18n/navigation"
import type { Brand } from "@/features/brands/types"
import { pickLocale, type Locale } from "@/lib/locale"

interface BrandCardProps {
  brand: Brand
  locale: Locale
}

// Card click routes into the existing catalog brand filter (?brand=<slug>) —
// no separate per-brand landing page, this page is a catalog index only.
function BrandCard({ brand, locale }: BrandCardProps) {
  const description = pickLocale(locale, {
    ru: brand.descriptionRu,
    tj: brand.descriptionTj,
    en: brand.descriptionEn,
  })

  return (
    <Link
      href={`/catalog?brand=${brand.slug}`}
      className="group block border border-border-default transition-colors duration-200 ease-out hover:border-border-hover"
    >
      {brand.logoUrl ? (
        <div className="relative aspect-[5/2] w-full bg-surface">
          <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-4" />
        </div>
      ) : (
        <div className="aspect-[5/2] w-full bg-surface" />
      )}
      <div className="p-4">
        <p className="font-display text-lg text-foreground underline-offset-4 group-hover:underline">
          {brand.name}
        </p>
        {description && <p className="mt-2 text-sm text-foreground">{description}</p>}
      </div>
    </Link>
  )
}

export { BrandCard }
