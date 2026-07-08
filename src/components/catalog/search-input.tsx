"use client"

import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { UIIcon } from "@/components/ui/ui-icon"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"

const DEBOUNCE_MS = 350

// Debounced, URL-driven search. Local state gives instant per-keystroke
// feedback; only the debounced value is written to the URL (via the same
// shared setParams as sort/filters), so the skeleton flashes once per pause
// in typing, not once per keystroke. Synced back from the URL param so
// browser back/forward and "clear all filters" update the box too.
function SearchInput() {
  const t = useTranslations("Catalog.search")
  const { params, setParams } = useCatalogParams()
  const [value, setValue] = useState(params.search ?? "")

  useEffect(() => {
    setValue(params.search ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.search])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== (params.search ?? "")) {
        setParams({ search: value || undefined })
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full">
      <UIIcon
        icon={SearchIcon}
        size={16}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--secondary)]"
      />
      <Input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        className="pl-10"
      />
    </div>
  )
}

export { SearchInput }
