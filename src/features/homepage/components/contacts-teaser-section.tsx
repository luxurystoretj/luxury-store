import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import type { HomepageSection } from "@/features/homepage/types"
import { pickLocale, type Locale } from "@/lib/locale"

interface ContactsTeaserSectionProps {
  sections: HomepageSection[]
  locale: Locale
}

// HomepageSection-backed ("contacts" key) — a compact teaser distinct from
// the full static /contacts page (T5.3), which reads its content from
// messages/*.json instead. Returns null when the row is missing or its
// picked title resolves to null.
async function ContactsTeaserSection({ sections, locale }: ContactsTeaserSectionProps) {
  const contacts = sections.find((section) => section.sectionKey === "contacts")
  if (!contacts) {
    return null
  }

  const title = pickLocale(locale, {
    ru: contacts.titleRu,
    tj: contacts.titleTj,
    en: contacts.titleEn,
  })
  if (!title) {
    return null
  }

  const subtitle = pickLocale(locale, {
    ru: contacts.subtitleRu,
    tj: contacts.subtitleTj,
    en: contacts.subtitleEn,
  })
  const t = await getTranslations("Home")

  return (
    <section className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
      <h2 className="font-display text-2xl">{title}</h2>
      {subtitle && <p className="text-foreground">{subtitle}</p>}
      <Link
        href="/contacts"
        className="text-foreground underline decoration-border-default underline-offset-[3px] transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t("contactsTeaser.cta")}
      </Link>
    </section>
  )
}

export { ContactsTeaserSection }
