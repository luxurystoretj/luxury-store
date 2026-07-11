import { getTranslations } from "next-intl/server"

import { Container } from "@/components/layout/container"
import { Link } from "@/i18n/navigation"

// No `params` prop here (unlike page.tsx) and no explicit setRequestLocale
// call — the enclosing [locale]/layout.tsx has already established locale
// context earlier in the same render pass. Catches both explicit notFound()
// calls (PDP) and genuinely unmatched routes under /[locale]/*.
export default async function NotFound() {
  const t = await getTranslations("NotFound")

  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-3xl">{t("title")}</h1>
      <p className="text-foreground">{t("description")}</p>
      <Link
        href="/catalog"
        className="text-foreground underline decoration-border-default underline-offset-[3px] transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t("cta")}
      </Link>
    </Container>
  )
}
