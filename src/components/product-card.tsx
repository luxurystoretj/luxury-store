import { Link } from "@/i18n/navigation"
import { ProductImage } from "@/components/product-image"
import { pickLocale, type Locale } from "@/lib/locale"
import { formatPrice } from "@/lib/price"
import type { Product } from "@/features/products/types"

interface ProductCardProps {
  product: Product
  locale: Locale
  /** Above-fold (first grid row) → true, disables native lazy loading. */
  priority?: boolean
  /** Show brand/name but omit price. Owner-requested exception for the home product rows. */
  hidePrice?: boolean
}

// DESIGN §8: card content is strictly brand → name → price, nothing else.
// DESIGN §7: hover = border-color shift + name underline only, no scale/shadow.
function ProductCard({ product, locale, priority = false, hidePrice = false }: ProductCardProps) {
  const name = pickLocale(locale, {
    ru: product.nameRu,
    tj: product.nameTj,
    en: product.nameEn,
  })
  const image = product.images[0]

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-border-default transition-colors duration-200 ease-out hover:border-border-hover"
    >
      {image ? (
        <ProductImage
          image={image}
          productName={name}
          brand={product.brand.name}
          aspect="3:4"
          priority={priority}
        />
      ) : (
        <div className="aspect-[3/4] w-full bg-surface" />
      )}
      <div className="p-4">
        <p className="text-sm text-foreground">{product.brand.name}</p>
        <p className="mt-1 text-foreground underline-offset-4 group-hover:underline">
          {name}
        </p>
        {!hidePrice && (
          <p
            className="mt-2 font-display text-[1.125rem]"
            style={{ fontVariantNumeric: "lining-nums" }}
          >
            {formatPrice(product.priceTjs, "TJS", locale)}
          </p>
        )}
      </div>
    </Link>
  )
}

export { ProductCard }
