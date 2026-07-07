"use client"

import { MenuIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UIIcon } from "@/components/ui/ui-icon"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { navLinks } from "@/components/layout/nav-links"

// Uses T2.3's Sheet as-is. Each nav link is a Base UI Close composed with next-intl's
// Link via `render` (not Radix asChild) so tapping a link both navigates and closes —
// nativeButton={false} tells Base UI the rendered element is an <a>, not a <button>.
function MobileNav() {
  const t = useTranslations("Nav")

  return (
    <Sheet>
      <SheetTrigger
        aria-label={t("openMenu")}
        className="inline-flex size-10 items-center justify-center text-foreground transition-colors duration-150 ease-out hover:text-[var(--accent)] md:hidden"
      >
        <UIIcon icon={MenuIcon} size={24} />
      </SheetTrigger>
      <SheetContent side="right" closeLabel={t("closeMenu")}>
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <nav className="flex flex-col gap-1 p-6 pt-16">
          {navLinks.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className="px-2 py-3 text-base text-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:underline hover:decoration-1"
                >
                  {t(item.labelKey)}
                </Link>
              }
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-border-subtle p-6">
          <LocaleSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
