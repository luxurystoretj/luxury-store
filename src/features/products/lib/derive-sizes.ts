import type { Product } from "@/features/products/types"

/**
 * Distinct `size` values across a product list, numeric-aware sorted ascending
 * with non-numeric sizes (e.g. "One Size") last. No dedicated sizes endpoint
 * exists — `ProductSize.size` is a locale-invariant free-text column, so this
 * is derived from live data rather than a fixed/translated dictionary.
 */
export function deriveSizes(products: Product[]): string[] {
  const values = new Set<string>()
  for (const product of products) {
    for (const size of product.sizes) {
      values.add(size.size)
    }
  }

  return Array.from(values).sort((a, b) => {
    const numA = Number(a)
    const numB = Number(b)
    if (Number.isNaN(numA) && Number.isNaN(numB)) return a.localeCompare(b)
    if (Number.isNaN(numA)) return 1
    if (Number.isNaN(numB)) return -1
    return numA - numB
  })
}
