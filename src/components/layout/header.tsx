import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/layout/container"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { MobileNav } from "@/components/layout/mobile-nav"
import { navLinks } from "@/components/layout/nav-links"

// DESIGN §2/§7/§10: hairline bottom border, tertiary-link nav states.
async function Header() {
  const t = await getTranslations("Nav")

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-background">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-normal text-foreground"
        >
          Luxury Store
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-4">
          <LocaleSwitcher className="hidden md:flex" />
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

export { Header }
