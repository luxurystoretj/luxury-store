"use client"

import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"
import { colorOptions } from "@/components/catalog/color-options"
import { pickLocale, type Locale } from "@/lib/locale"
import type { Brand } from "@/features/brands/types"
import type { Category } from "@/features/categories/types"

const ALL_VALUE = "__all__"

interface FilterFieldsProps {
  brands: Brand[]
  categories: Category[]
  sizes: string[]
  // Desktop only (FilterToolbar) — MobileFilterSheet has its own reset in the
  // sheet footer already, so the inline row reset stays opt-in to avoid a
  // second, redundant reset control there.
  showReset?: boolean
}

// Shared filter controls, rendered by both FilterToolbar (desktop) and
// MobileFilterSheet — the actual read/write logic lives here once so desktop
// and mobile never diverge. Brand/category are Select dropdowns (longer,
// actively-growing lists); color/size are Badge toggle groups (DESIGN §7).
// All four are single-select — the API takes one value per param, not arrays —
// so clicking an already-selected badge clears it.
function FilterFields({ brands, categories, sizes, showReset = false }: FilterFieldsProps) {
  const t = useTranslations("Catalog.filters")
  const locale = useLocale() as Locale
  const { params, setParams } = useCatalogParams()
  const hasActiveFilters = Boolean(params.brand || params.category || params.color || params.size)

  const brandLabel = (slug: string) =>
    slug === ALL_VALUE ? t("allBrands") : (brands.find((b) => b.slug === slug)?.name ?? slug)
  const categoryLabel = (slug: string) => {
    if (slug === ALL_VALUE) return t("allCategories")
    const category = categories.find((c) => c.slug === slug)
    return category
      ? pickLocale(locale, { ru: category.nameRu, tj: category.nameTj, en: category.nameEn })
      : slug
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
          {t("brand")}
        </label>
        <Select
          value={params.brand ?? ALL_VALUE}
          onValueChange={(next: unknown) =>
            setParams({ brand: next === ALL_VALUE ? undefined : (next as string) })
          }
        >
          <SelectTrigger aria-label={t("brand")} className="w-full sm:w-48">
            <SelectValue>{(v: unknown) => brandLabel((v as string) ?? ALL_VALUE)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t("allBrands")}</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.slug}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
          {t("category")}
        </label>
        <Select
          value={params.category ?? ALL_VALUE}
          onValueChange={(next: unknown) =>
            setParams({ category: next === ALL_VALUE ? undefined : (next as string) })
          }
        >
          <SelectTrigger aria-label={t("category")} className="w-full sm:w-48">
            <SelectValue>{(v: unknown) => categoryLabel((v as string) ?? ALL_VALUE)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t("allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {pickLocale(locale, {
                  ru: category.nameRu,
                  tj: category.nameTj,
                  en: category.nameEn,
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
          {t("color")}
        </p>
        <div className="flex max-w-md flex-wrap gap-2">
          {colorOptions.map((option) => (
            <Badge
              key={option.value}
              variant={params.color === option.value ? "selected" : "default"}
              render={
                <button
                  type="button"
                  onClick={() =>
                    setParams({
                      color: params.color === option.value ? undefined : option.value,
                    })
                  }
                />
              }
            >
              {pickLocale(locale, { ru: option.value, tj: option.value, en: option.labelEn })}
            </Badge>
          ))}
        </div>
      </div>

      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
            {t("size")}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant={params.size === size ? "selected" : "default"}
                render={
                  <button
                    type="button"
                    onClick={() =>
                      setParams({ size: params.size === size ? undefined : size })
                    }
                  />
                }
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {showReset && hasActiveFilters && (
        <div className="flex flex-col gap-2">
          <span className="invisible text-xs font-semibold tracking-[0.12em] uppercase" aria-hidden="true">
            {t("reset")}
          </span>
          <Button
            type="button"
            variant="ghost"
            className="px-0 py-3"
            onClick={() =>
              setParams({ brand: undefined, category: undefined, color: undefined, size: undefined })
            }
          >
            {t("reset")}
          </Button>
        </div>
      )}
    </div>
  )
}

export { FilterFields }
