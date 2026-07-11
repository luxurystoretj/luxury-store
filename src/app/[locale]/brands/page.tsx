import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/layout/container"
import { BrandGrid } from "@/features/brands/components/brand-grid"
import { getBrands } from "@/features/brands/api"
import type { Locale } from "@/lib/locale"

interface BrandsPageProps {
  params: Promise<{ locale: string }>
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const brands = await getBrands()
  const t = await getTranslations("Brands")

  return (
    <Container className="py-12 md:py-16 lg:py-24">
      <h1 className="mb-8 font-display text-3xl">{t("title")}</h1>
      <BrandGrid brands={brands} locale={locale as Locale} />
    </Container>
  )
}
