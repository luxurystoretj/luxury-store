"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { UIIcon } from "@/components/ui/ui-icon"
import { cn } from "@/lib/utils"
import { pickLocale, type Locale } from "@/lib/locale"
import type { CategoryBannerPublic } from "@/features/category-banners/types"

interface CategoryBannersSectionProps {
  banners: CategoryBannerPublic[];
  locale: Locale;
}

// Manual-navigation-only image carousel (arrows + dashes), NO autoplay — carousel
// auto-play is on DESIGN §10's closed forbidden-motion list. Renders nothing when
// there are no active banners (mirrors NewArrivalsSection's conditional pattern —
// no heading, no gap, no empty section).
//
// Slide height: tiered fixed px per breakpoint (180 mobile / 320 tablet / 480 desktop),
// not a CSS aspect-ratio — owner-settled after a live crop comparison against a
// ruler-annotated test photo (session plan). A single global fixed height was ruled
// out (it dominates the mobile viewport); pure 3:1 was ruled out in favor of a height
// that doesn't shift as the window resizes within a breakpoint. Crops ~18%/26%/41% of
// a 16:9 source at mobile/tablet/desktop respectively — desktop crops the MOST despite
// being the tallest tier, since 1440/480=3:1 is the widest-relative-to-height box of
// the three. Photographer guidance: keep the subject's key content within the center
// ~60% of the frame vertically (>=20% margin top and bottom) so it survives every tier.
export function CategoryBannersSection({ banners, locale }: CategoryBannersSectionProps) {
  const t = useTranslations("Home.categoryBanners")
  const [index, setIndex] = useState(0)

  if (banners.length === 0) {
    return null
  }

  const current = banners[index]
  const hasMultiple = banners.length > 1

  function goTo(next: number) {
    setIndex(((next % banners.length) + banners.length) % banners.length)
  }

  const alt = pickLocale(locale, {
    ru: current.category.nameRu,
    tj: current.category.nameTj,
    en: current.category.nameEn,
  })

  return (
    <section>
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-1">
        <div className="relative h-[180px] w-full overflow-hidden bg-surface md:h-[320px] lg:h-[480px]">
          <Link href={`/catalog?category=${current.category.slug}`}>
            <Image
              src={current.imageUrl}
              alt={alt}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </Link>

          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label={t("previous")}
                onClick={() => goTo(index - 1)}
                className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center bg-[rgba(250,250,248,0.8)] p-2 text-foreground transition-colors duration-150 ease-out outline-none hover:text-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <UIIcon icon={ChevronLeftIcon} size={24} />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                onClick={() => goTo(index + 1)}
                className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center bg-[rgba(250,250,248,0.8)] p-2 text-foreground transition-colors duration-150 ease-out outline-none hover:text-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <UIIcon icon={ChevronRightIcon} size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {banners.map((banner, i) => (
                  <button
                    key={banner.id}
                    type="button"
                    aria-label={t("goToSlide", { index: i + 1 })}
                    aria-current={i === index}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-[3px] w-6 outline-none transition-colors duration-150 ease-out focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      i === index ? "bg-[var(--accent)]" : "bg-border-default"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
