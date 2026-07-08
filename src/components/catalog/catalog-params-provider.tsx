"use client"

import { createContext, useContext, useTransition, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/navigation"
import type { ProductListParams } from "@/features/products/api"
import { parseProductListParams } from "@/features/products/lib/parse-list-params"

type ParamPatch = Partial<Record<keyof ProductListParams, string | undefined>>

interface CatalogParamsContextValue {
  params: ProductListParams
  setParams: (patch: ParamPatch) => void
  isPending: boolean
}

const CatalogParamsContext = createContext<CatalogParamsContextValue | null>(null)

// Single shared URL-params layer for sort (T3.1), filters (T3.2), and search (T3.3).
// `useTransition` is called exactly ONCE, here, so every consumer (SortControl,
// FilterToolbar, MobileFilterSheet, SearchInput, CatalogGridSlot) reads the same
// `isPending` via context — a filter change and the grid's pending state are the
// same boolean, not independent per-component transitions. Wrapping `router.push`
// in `startTransition` is what gives instant pending feedback for the Server
// Component (`page.tsx`) re-render this navigation triggers, without a redundant
// client-side data fetch.
function CatalogParamsProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const params = parseProductListParams((key) => searchParams.get(key))

  function setParams(patch: ParamPatch) {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    const queryString = next.toString()
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  return (
    <CatalogParamsContext.Provider value={{ params, setParams, isPending }}>
      {children}
    </CatalogParamsContext.Provider>
  )
}

function useCatalogParams() {
  const ctx = useContext(CatalogParamsContext)
  if (!ctx) {
    throw new Error("useCatalogParams must be used within CatalogParamsProvider")
  }
  return ctx
}

export { CatalogParamsProvider, useCatalogParams }
