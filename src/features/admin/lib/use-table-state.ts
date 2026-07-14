"use client"

import { useMemo, useState } from "react"

export type SortDir = "asc" | "desc"

export interface UseTableStateOptions<T> {
  searchableText: (row: T) => string;
  sorters: Record<string, (a: T, b: T) => number>;
  defaultSortKey: string;
  defaultSortDir?: SortDir;
}

export interface UseTableStateResult<T> {
  query: string;
  setQuery: (query: string) => void;
  sortKey: string;
  sortDir: SortDir;
  toggleSort: (key: string) => void;
  rows: T[];
}

// Client-side-only sort+search for small, un-paginated admin lists (no server params, no
// URL state, no debounce — filtering/sorting an in-memory array is synchronous and cheap).
// See the session plan for why this is deliberately NOT the Phase 3 catalog's URL-param
// pattern: that one assumes a Server Component re-fetch on navigation, which brands/
// categories have nothing server-side to re-invoke (their admin GETs take no query params).
export function useTableState<T>(
  rows: T[],
  { searchableText, sorters, defaultSortKey, defaultSortDir = "asc" }: UseTableStateOptions<T>
): UseTableStateResult<T> {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);

  function toggleSort(key: string) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const result = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed
      ? rows.filter((row) => searchableText(row).toLowerCase().includes(trimmed))
      : rows;

    const sorter = sorters[sortKey];
    if (!sorter) return filtered;

    const sorted = [...filtered].sort(sorter);
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [rows, query, sortKey, sortDir, searchableText, sorters]);

  return { query, setQuery, sortKey, sortDir, toggleSort, rows: result };
}
