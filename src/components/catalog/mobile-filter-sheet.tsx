"use client"

import { SlidersHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { UIIcon } from "@/components/ui/ui-icon"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterFields } from "@/components/catalog/filter-fields"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"
import type { Brand } from "@/features/brands/types"
import type { Category } from "@/features/categories/types"

interface MobileFilterSheetProps {
  brands: Brand[]
  categories: Category[]
  sizes: string[]
}

// Mobile only (lg:hidden). Filter controls (Select/Badge) are plain — never
// SheetClose-wrapped — so toggling them never closes the sheet (Base UI only
// closes on an actual Close-wrapped element, confirmed against mobile-nav's
// LocaleSwitcher precedent). Filters commit live to the URL on each tap, same
// as desktop, so there's no draft state: "Reset" clears filter params and
// stays open so the user sees the reset take effect; "Show results" is a pure
// close affordance (SheetClose-wrapped) since filtering already happened.
function MobileFilterSheet({ brands, categories, sizes }: MobileFilterSheetProps) {
  const t = useTranslations("Catalog.filters")
  const { setParams } = useCatalogParams()

  return (
    <Sheet>
      <SheetTrigger
        aria-label={t("button")}
        className="inline-flex items-center gap-2 border border-border-default px-3.5 py-3 text-sm text-foreground transition-colors duration-150 ease-out hover:border-border-hover lg:hidden"
      >
        <UIIcon icon={SlidersHorizontalIcon} size={20} />
        {t("button")}
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel={t("button")} className="max-h-[85vh] overflow-y-auto">
        <SheetTitle className="px-6 pt-6">{t("title")}</SheetTitle>
        <div className="px-6">
          <FilterFields brands={brands} categories={categories} sizes={sizes} />
        </div>
        <SheetFooter className="flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() =>
              setParams({
                brand: undefined,
                category: undefined,
                color: undefined,
                size: undefined,
              })
            }
          >
            {t("reset")}
          </Button>
          <SheetClose
            render={
              <Button type="button" className="flex-1">
                {t("showResults")}
              </Button>
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { MobileFilterSheet }
