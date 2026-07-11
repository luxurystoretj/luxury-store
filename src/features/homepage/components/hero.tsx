import Image from "next/image"
import { getTranslations } from "next-intl/server"

import type { HomepageSection } from "@/features/homepage/types"
import { pickLocale, type Locale } from "@/lib/locale"

interface HeroProps {
  sections: HomepageSection[]
  locale: Locale
}

// Falls back to the existing HomePage.title/tagline keys when the "hero" row
// is missing or its picked title/subtitle resolve to null.
async function Hero({ sections, locale }: HeroProps) {
  const hero = sections.find((section) => section.sectionKey === "hero")
  const t = await getTranslations("HomePage")

  const title =
    pickLocale(locale, {
      ru: hero?.titleRu ?? null,
      tj: hero?.titleTj ?? null,
      en: hero?.titleEn ?? null,
    }) ?? t("title")
  const subtitle =
    pickLocale(locale, {
      ru: hero?.subtitleRu ?? null,
      tj: hero?.subtitleTj ?? null,
      en: hero?.subtitleEn ?? null,
    }) ?? t("tagline")

  return (
    <section className="flex flex-col gap-8">
      {hero?.imageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface">
          <Image src={hero.imageUrl} alt={title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        <p className="text-foreground">{subtitle}</p>
      </div>
    </section>
  )
}

export { Hero }
