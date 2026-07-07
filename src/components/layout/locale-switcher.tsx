"use client"

import { useLocale, useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

// DESIGN §7 tertiary-link states for the inactive locale; active locale is plain text.
// Iterates routing.locales (not hardcoded ru/en) so adding Tajik later needs no change here.
function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("LocaleSwitcher")

  return (
    <nav
      aria-label={t("label")}
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1.5">
          {index > 0 && (
            <span aria-hidden className="text-border-default">
              /
            </span>
          )}
          {loc === locale ? (
            <span aria-current="true" className="text-foreground">
              {loc.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={loc}
              className="text-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:underline hover:decoration-1"
            >
              {loc.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

export { LocaleSwitcher }
