import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/layout/container"
import { navLinks } from "@/components/layout/nav-links"

// DESIGN §1 hard rule: secondary gray (#9B9489) is for >18px text only, never small
// text — so all footer copy uses full-contrast graphite (text-foreground), not secondary.
// Contacts are a placeholder stub; real data is a pending owner input.
async function Footer() {
  const t = await getTranslations("Nav")
  const tf = await getTranslations("Footer")

  return (
    <footer className="border-t border-border-default">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Link
            href="/"
            className="font-display text-xl font-normal text-foreground"
          >
            Luxury Store
          </Link>

          <nav className="flex flex-col gap-2 md:flex-row md:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:underline hover:decoration-1"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-1 text-sm text-foreground">
            <span>{tf("cities")}</span>
            <span>{tf("phone")}</span>
            <span>{tf("email")}</span>
          </div>
        </div>

        <p className="border-t border-border-subtle pt-6 text-xs text-foreground">
          {tf("rights")}
        </p>
      </Container>
    </footer>
  )
}

export { Footer }
