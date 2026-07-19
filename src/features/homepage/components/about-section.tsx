import type { HomepageSection } from "@/features/homepage/types"
import { pickLocale, type Locale } from "@/lib/locale"

interface AboutSectionProps {
  sections: HomepageSection[]
  locale: Locale
}

// HomepageSection-backed ("about" key) — returns null when the row is
// missing or its picked title resolves to null (title-less teaser is
// meaningless). Subtitle is optional and never gates the section.
function AboutSection({ sections, locale }: AboutSectionProps) {
  const about = sections.find((section) => section.sectionKey === "about")
  if (!about) {
    return null
  }

  const title = pickLocale(locale, { ru: about.titleRu, tj: about.titleTj, en: about.titleEn })
  if (!title) {
    return null
  }

  const subtitle = pickLocale(locale, {
    ru: about.subtitleRu,
    tj: about.subtitleTj,
    en: about.subtitleEn,
  })

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-b border-border-default bg-surface px-3 py-16 md:py-24">
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className="mb-4 font-display text-2xl">{title}</h2>
        {subtitle && <p className="text-foreground">{subtitle}</p>}
      </div>
    </section>
  )
}

export { AboutSection }
