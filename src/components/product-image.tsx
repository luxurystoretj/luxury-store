"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { pickLocale, type Locale } from "@/lib/locale"
import type { ProductImage as ProductImageData } from "@/features/products/types"

type ProductImageAspect = "3:4" | "1:1" | "21:9"

const aspectClass: Record<ProductImageAspect, string> = {
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
  "21:9": "aspect-[21/9]",
}

interface ProductImageProps {
  image: ProductImageData
  productName: string
  /** Brand.name; omit for contexts without a brand (e.g. RelatedProduct). */
  brand?: string
  aspect?: ProductImageAspect
  /** Above-fold (hero, first catalog row) → true. Disables native lazy loading. */
  priority?: boolean
  /** Tuned for the DESIGN §5 product grid (2/3/4 cols); override for other contexts. */
  sizes?: string
  className?: string
}

// DESIGN §8: single wrapper for every product image — never next/image directly elsewhere.
function ProductImage({
  image,
  productName,
  brand,
  aspect = "3:4",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className,
}: ProductImageProps) {
  const locale = useLocale() as Locale
  const t = useTranslations("ProductImage")
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading")
  const imgRef = useRef<HTMLImageElement>(null)

  // Cached images can already be `complete` before React attaches onLoad, which would
  // otherwise leave the fade-in stuck at opacity-0 forever.
  useEffect(() => {
    if (imgRef.current?.complete) setStatus("loaded")
  }, [])

  const alt =
    pickLocale(locale, {
      ru: image.altRu ?? undefined,
      tj: image.altTj ?? undefined,
      en: image.altEn ?? undefined,
    }) ?? (brand ? `${brand} — ${productName}` : productName)

  if (status === "error") {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center border border-dashed border-border-default bg-surface p-4 text-center text-sm text-[var(--secondary)]",
          aspectClass[aspect],
          className
        )}
      >
        {t("error")}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-surface",
        aspectClass[aspect],
        className
      )}
    >
      <Image
        ref={imgRef}
        src={image.imageUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={image.blurDataURL ? "blur" : undefined}
        blurDataURL={image.blurDataURL ?? undefined}
        className={cn(
          "object-cover transition-opacity duration-[250ms] ease-out",
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  )
}

export { ProductImage }
export type { ProductImageProps, ProductImageAspect }
