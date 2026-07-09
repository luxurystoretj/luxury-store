import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import type { ProductSize } from "@/features/products/types"

interface ProductSizesProps {
  sizes: ProductSize[]
}

// DESIGN §7: quantity=0 renders ghosted via Badge's built-in aria-disabled styling,
// never opacity. Purely informational — no cart/selection, plain <span> not <button>.
async function ProductSizes({ sizes }: ProductSizesProps) {
  if (sizes.length === 0) {
    return null
  }

  const t = await getTranslations("Product")

  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-foreground uppercase">
        {t("size")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Badge
            key={size.id}
            aria-disabled={size.quantity === 0}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {size.size}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export { ProductSizes }
