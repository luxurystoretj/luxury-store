"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UIIcon } from "@/components/ui/ui-icon"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"
import { colorOptions } from "@/components/catalog/color-options"
import { cn } from "@/lib/utils"
import { pickLocale, type Locale } from "@/lib/locale"
import type { Brand } from "@/features/brands/types"
import type { Category } from "@/features/categories/types"

interface FilterFieldsProps {
  brands: Brand[]
  categories: Category[]
  sizes: string[]
  // Desktop only (FilterToolbar) — MobileFilterSheet has its own reset in the
  // sheet footer already, so the inline row reset stays opt-in to avoid a
  // second, redundant reset control there.
  showReset?: boolean
}

interface MultiSelectOption {
  value: string
  label: string
}

// VISUAL MOCKUP ONLY (owner request, 2026-07-22) — brand/category/color/size
// were real single-select controls wired to URL params (brand/category via
// Select, color/size via Badge toggle groups). This renders the same trigger
// chrome the original Select used (classes copied verbatim) but opens a
// checkbox Menu instead, and keeps checked state in plain useState local to
// this component. NOT wired to useCatalogParams, does not touch the URL or
// the product grid. Purely to preview the look and interaction before
// deciding whether to build it for real (which would need a backend change:
// the API's brand/category/color/size params are single-value today).
function MultiSelectFilter({
  label,
  placeholder,
  options,
  selected,
  onToggle,
}: {
  label: string
  placeholder: string
  options: MultiSelectOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  const t = useTranslations("Catalog.filters")
  const triggerText = selected.length === 0 ? placeholder : t("selectedCount", { count: selected.length })

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={label}
          className="flex w-full items-center justify-between gap-2 rounded-sm border border-border-default bg-background px-3.5 py-3 text-base text-foreground transition-colors duration-150 ease-out outline-none select-none hover:border-border-hover focus-visible:border-border-strong focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-48"
        >
          <span className={cn("truncate", selected.length === 0 && "text-[var(--secondary)]")}>
            {triggerText}
          </span>
          <UIIcon icon={ChevronDownIcon} size={16} className="shrink-0 text-[var(--secondary)]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[var(--anchor-width)]">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Shared filter controls, rendered by both FilterToolbar (desktop) and
// MobileFilterSheet — the actual read/write logic lives here once so desktop
// and mobile never diverge. All four (brand/category/color/size) are mock
// multi-select dropdowns for now — see MultiSelectFilter above.
function FilterFields({ brands, categories, sizes, showReset = false }: FilterFieldsProps) {
  const t = useTranslations("Catalog.filters")
  const locale = useLocale() as Locale
  const { params, setParams } = useCatalogParams()
  const hasActiveFilters = Boolean(params.brand || params.category || params.color || params.size)

  const [mockSelectedBrands, setMockSelectedBrands] = useState<string[]>([])
  const [mockSelectedCategories, setMockSelectedCategories] = useState<string[]>([])
  const [mockSelectedColors, setMockSelectedColors] = useState<string[]>([])
  const [mockSelectedSizes, setMockSelectedSizes] = useState<string[]>([])
  const toggleMockBrand = (value: string) =>
    setMockSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  const toggleMockCategory = (value: string) =>
    setMockSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  const toggleMockColor = (value: string) =>
    setMockSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  const toggleMockSize = (value: string) =>
    setMockSelectedSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )

  return (
    <div className="flex flex-wrap items-start gap-6">
      <MultiSelectFilter
        label={t("brand")}
        placeholder={t("allBrands")}
        options={brands.map((brand) => ({ value: brand.slug, label: brand.name }))}
        selected={mockSelectedBrands}
        onToggle={toggleMockBrand}
      />

      <MultiSelectFilter
        label={t("category")}
        placeholder={t("allCategories")}
        options={categories.map((category) => ({
          value: category.slug,
          label:
            pickLocale(locale, {
              ru: category.nameRu,
              tj: category.nameTj,
              en: category.nameEn,
            }) ?? category.slug,
        }))}
        selected={mockSelectedCategories}
        onToggle={toggleMockCategory}
      />

      <MultiSelectFilter
        label={t("color")}
        placeholder={t("allColors")}
        options={colorOptions.map((option) => ({
          value: option.value,
          label: pickLocale(locale, { ru: option.value, tj: option.value, en: option.labelEn }) ?? option.value,
        }))}
        selected={mockSelectedColors}
        onToggle={toggleMockColor}
      />

      {sizes.length > 0 && (
        <MultiSelectFilter
          label={t("size")}
          placeholder={t("allSizes")}
          options={sizes.map((size) => ({ value: size, label: size }))}
          selected={mockSelectedSizes}
          onToggle={toggleMockSize}
        />
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
