import type { ProductListParams } from "@/features/products/api"

const SORT_VALUES: ReadonlySet<string> = new Set(["new", "price_asc", "price_desc"])

/**
 * Shared parser for `ProductListParams`, used both server-side (against awaited
 * `searchParams`) and client-side (against `useSearchParams().get`) so the param
 * shape and the `sort` whitelist aren't duplicated between the two call sites.
 */
export function parseProductListParams(
  get: (key: string) => string | null
): ProductListParams {
  const sort = get("sort")
  return {
    search: get("search") ?? undefined,
    brand: get("brand") ?? undefined,
    category: get("category") ?? undefined,
    color: get("color") ?? undefined,
    size: get("size") ?? undefined,
    sort: sort && SORT_VALUES.has(sort) ? (sort as ProductListParams["sort"]) : undefined,
  }
}
