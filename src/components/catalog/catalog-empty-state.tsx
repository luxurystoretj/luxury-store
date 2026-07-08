"use client"

import { useTranslations } from "next-intl"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"

function CatalogEmptyState() {
  const t = useTranslations("Catalog.empty")
  const { setParams } = useCatalogParams()

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="font-display text-xl text-foreground">{t("title")}</p>
      <p className="text-foreground">{t("description")}</p>
      <button
        type="button"
        onClick={() =>
          setParams({
            search: undefined,
            brand: undefined,
            category: undefined,
            color: undefined,
            size: undefined,
          })
        }
        className="text-foreground underline decoration-border-default underline-offset-[3px] transition-colors duration-150 ease-out hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t("clear")}
      </button>
    </div>
  )
}

export { CatalogEmptyState }
