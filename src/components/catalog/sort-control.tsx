"use client"

import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"
import type { ProductListParams } from "@/features/products/api"

type SortValue = NonNullable<ProductListParams["sort"]>

const SORT_LABEL_KEYS: Record<SortValue, string> = {
  new: "new",
  price_asc: "priceAsc",
  price_desc: "priceDesc",
}

const SORT_OPTIONS: SortValue[] = ["new", "price_asc", "price_desc"]

function SortControl() {
  const t = useTranslations("Catalog.sort")
  const { params, setParams } = useCatalogParams()
  const value: SortValue = params.sort ?? "new"

  return (
    <Select
      value={value}
      onValueChange={(next) =>
        setParams({ sort: next === "new" ? undefined : (next as SortValue) })
      }
    >
      <SelectTrigger aria-label={t("label")} className="w-full sm:w-56">
        {/* Select.Value shows the raw value by default; render the localized label. */}
        <SelectValue>{(v: SortValue | null) => t(SORT_LABEL_KEYS[v ?? "new"])}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {t(SORT_LABEL_KEYS[option])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { SortControl }
