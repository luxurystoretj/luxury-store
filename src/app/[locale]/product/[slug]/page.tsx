import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/layout/container"
import { ProductAttributes } from "@/components/product-detail/product-attributes"
import { ProductGallery } from "@/components/product-detail/product-gallery"
import { ProductSizes } from "@/components/product-detail/product-sizes"
import { RelatedProducts } from "@/components/product-detail/related-products"
import { getProductBySlug } from "@/features/products/api"
import { pickLocale, type Locale } from "@/lib/locale"
import { formatPrice } from "@/lib/price"

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const localeTyped = locale as Locale
  const name = pickLocale(localeTyped, {
    ru: product.nameRu,
    tj: product.nameTj,
    en: product.nameEn,
  })
  const description = pickLocale(localeTyped, {
    ru: product.descriptionRu,
    tj: product.descriptionTj,
    en: product.descriptionEn,
  })

  return {
    title: `${name} — ${product.brand.name} | Luxury Store`,
    ...(description ? { description } : {}),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const t = await getTranslations("Product")
  const localeTyped = locale as Locale

  const name = pickLocale(localeTyped, {
    ru: product.nameRu,
    tj: product.nameTj,
    en: product.nameEn,
  })
  const categoryName = pickLocale(localeTyped, {
    ru: product.category.nameRu,
    tj: product.category.nameTj,
    en: product.category.nameEn,
  })
  const description = pickLocale(localeTyped, {
    ru: product.descriptionRu,
    tj: product.descriptionTj,
    en: product.descriptionEn,
  })
  const composition = pickLocale(localeTyped, {
    ru: product.compositionRu,
    tj: product.compositionTj,
    en: product.compositionEn,
  })
  const color = pickLocale(localeTyped, {
    ru: product.colorRu,
    tj: product.colorTj,
    en: product.colorEn,
  })

  return (
    <Container className="py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} productName={name} brand={product.brand.name} />
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              {product.brand.name} · {categoryName}
            </p>
            <h1 className="font-display text-3xl md:text-4xl">{name}</h1>
            <p
              className="font-display text-[1.75rem]"
              style={{ fontVariantNumeric: "lining-nums" }}
            >
              {formatPrice(product.priceTjs, "TJS", localeTyped)}
            </p>
          </div>
          <ProductAttributes
            attributes={[
              { label: t("description"), value: description },
              { label: t("composition"), value: composition },
              { label: t("color"), value: color },
            ]}
          />
          <ProductSizes sizes={product.sizes} />
        </div>
      </div>
      <RelatedProducts relatedFrom={product.relatedFrom} locale={localeTyped} />
    </Container>
  )
}
