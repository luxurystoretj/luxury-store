"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { ProductImage } from "@/components/product-image"
import type { ProductImage as ProductImageData } from "@/features/products/types"

interface ProductGalleryProps {
  images: ProductImageData[]
  productName: string
  brand: string
}

// DESIGN §8/§10: 3:4 main + 1:1 thumbnails, static click-to-switch, no autoplay/carousel.
function ProductGallery({ images, productName, brand }: ProductGalleryProps) {
  const t = useTranslations("Product")
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full bg-surface" />
  }

  const activeImage = images[activeIndex]

  return (
    <div>
      {/* key forces a remount per switch so ProductImage's own fade-in retriggers. */}
      <ProductImage
        key={activeImage.id}
        image={activeImage}
        productName={productName}
        brand={brand}
        aspect="3:4"
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={t("gallery.viewImage", { number: index + 1 })}
              aria-current={index === activeIndex}
              className={
                "w-20 border transition-colors duration-150 ease-out focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
                (index === activeIndex
                  ? "border-border-strong"
                  : "border-border-default hover:border-border-hover")
              }
            >
              <ProductImage
                image={image}
                productName={productName}
                brand={brand}
                aspect="1:1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { ProductGallery }
