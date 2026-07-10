import { Link } from "@/i18n/navigation"
import { ProductImage } from "@/components/product-image"
import { pickLocale, type Locale } from "@/lib/locale"
import { formatPrice } from "@/lib/price"
import type { RelatedProduct } from "@/features/products/types"

interface RelatedProductCardProps {
  product: RelatedProduct
  locale: Locale
}

// Same card shell as ProductCard, but RelatedProduct has no brand field —
// image → name → price only, per settled scope.
function RelatedProductCard({ product, locale }: RelatedProductCardProps) {
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
        <ProductImage image={image} productName={name} aspect="1:1" />
      ) : (
        <div className="aspect-square w-full bg-surface" />
      )}
      <div className="p-4">
        <p className="text-foreground underline-offset-4 group-hover:underline">{name}</p>
        <p
          className="mt-2 font-display text-[1.125rem]"
          style={{ fontVariantNumeric: "lining-nums" }}
        >
          {formatPrice(product.priceTjs, "TJS", locale)}
        </p>
      </div>
    </Link>
  )
}

export { RelatedProductCard }
