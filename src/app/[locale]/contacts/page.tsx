import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/layout/container"
import { ContactsMap } from "@/features/contacts/components/contacts-map"

interface ContactsPageProps {
  params: Promise<{ locale: string }>
}

// Static content, no DB table backs this page — copy lives entirely in the
// Contacts messages namespace.
export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Contacts")

  return (
    <Container className="py-12 md:py-16 lg:py-24">
      <h1 className="mb-8 font-display text-3xl">{t("title")}</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-8">
          <dl className="space-y-6">
            <div>
              <dt className="text-xs font-medium tracking-wide text-foreground uppercase">
                {t("address.label")}
              </dt>
              <dd className="mt-1 text-foreground">{t("address.value")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-foreground uppercase">
                {t("phone.label")}
              </dt>
              <dd className="mt-1 text-foreground">{t("phone.value")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-foreground uppercase">
                {t("email.label")}
              </dt>
              <dd className="mt-1 text-foreground">{t("email.value")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-foreground uppercase">
                {t("hours.label")}
              </dt>
              <dd className="mt-1 text-foreground">{t("hours.value")}</dd>
            </div>
          </dl>
          <div>
            <h2 className="mb-2 text-xs font-medium tracking-wide text-foreground uppercase">
              {t("socials.heading")}
            </h2>
            <p className="text-foreground">{t("socials.instagram")}</p>
            <p className="text-foreground">{t("socials.telegram")}</p>
          </div>
        </div>
        <ContactsMap />
      </div>
    </Container>
  )
}
