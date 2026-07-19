import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import type { HomepageSection } from "@/features/homepage/types"
import { pickLocale, type Locale } from "@/lib/locale"

interface ContactsTeaserSectionProps {
  sections: HomepageSection[]
  locale: Locale
}

// HomepageSection-backed ("contacts" key) — a compact teaser distinct from
// the full static /contacts page (T5.3). Title/subtitle stay DB-driven
// (admin-editable via /admin/homepage/contacts); the essentials below them
// (address/phone/email) are pulled from the same static Contacts messages
// namespace the real /contacts page uses, not duplicated content — one merged
// block rather than a second sequential contacts touchpoint. Returns null
// when the row is missing or its picked title resolves to null.
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
  const tc = await getTranslations("Contacts")

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-b border-border-default bg-surface px-3 py-16 md:py-24">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="text-foreground">{subtitle}</p>}
        <div className="flex flex-col gap-1 text-sm text-foreground">
          <p>{tc("address.value")}</p>
          <p>{tc("phone.value")}</p>
          <p>{tc("email.value")}</p>
        </div>
        <Link
          href="/contacts"
          className="text-foreground underline decoration-border-default underline-offset-[3px] transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {t("contactsTeaser.cta")}
        </Link>
      </div>
    </section>
  )
}

export { ContactsTeaserSection }
