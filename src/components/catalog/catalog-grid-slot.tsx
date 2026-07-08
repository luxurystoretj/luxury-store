"use client"

import type { ReactNode } from "react"
import { useCatalogParams } from "@/components/catalog/catalog-params-provider"
import { ProductGridSkeleton } from "@/components/catalog/product-grid-skeleton"

// Server decides WHAT to show (grid vs. empty state, computed in page.tsx from
// live data); this decides WHEN to show it vs. a skeleton (isPending, shared via
// CatalogParamsProvider). No client-side refetch — the server re-render on
// searchParams change is the only fetch, this just gates its reveal.
function CatalogGridSlot({ children }: { children: ReactNode }) {
  const { isPending } = useCatalogParams()
  if (isPending) return <ProductGridSkeleton />
  return <>{children}</>
}

export { CatalogGridSlot }
