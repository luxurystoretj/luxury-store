import { setRequestLocale } from "next-intl/server"

import { Container } from "@/components/layout/container"
import { AboutSection } from "@/features/homepage/components/about-section"
import { CategoryBannersSection } from "@/features/homepage/components/category-banners-section"
import { ContactsTeaserSection } from "@/features/homepage/components/contacts-teaser-section"
import { FeaturedSection } from "@/features/homepage/components/featured-section"
import { Hero } from "@/features/homepage/components/hero"
import { NewArrivalsSection } from "@/features/homepage/components/new-arrivals-section"
import { getCategoryBanners } from "@/features/category-banners/api"
import { getHomepageSections } from "@/features/homepage/api"
import { getProducts } from "@/features/products/api"
import type { Locale } from "@/lib/locale"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const localeTyped = locale as Locale

  const [sections, products, banners] = await Promise.all([
    getHomepageSections(),
    getProducts(),
    getCategoryBanners(),
  ])

  return (
    <Container className="pb-16 md:pb-24 lg:pb-32">
      <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
        <Hero sections={sections} locale={localeTyped} />
        <CategoryBannersSection banners={banners} locale={localeTyped} />
        <NewArrivalsSection products={products} locale={localeTyped} />
        <AboutSection sections={sections} locale={localeTyped} />
        <FeaturedSection products={products} locale={localeTyped} />
        <ContactsTeaserSection sections={sections} locale={localeTyped} />
      </div>
    </Container>
  )
}
