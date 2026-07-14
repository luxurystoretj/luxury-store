"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortableHeader } from "@/features/admin/components/sortable-header"
import { ConfirmDeleteRow } from "@/features/admin/components/confirm-delete-row"
import { useTableState } from "@/features/admin/lib/use-table-state"
import { adminDeleteProduct } from "@/features/products/api/admin"
import type { Product } from "@/features/products/types"
import { formatPrice, parsePrice } from "@/lib/price"

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();

  const { query, setQuery, sortKey, sortDir, toggleSort, rows } = useTableState(
    products,
    {
      defaultSortKey: "name",
      searchableText: (p) =>
        `${p.nameRu} ${p.nameTj} ${p.nameEn} ${p.brand.name} ${p.category.nameRu}`,
      sorters: {
        name: (a, b) => a.nameRu.localeCompare(b.nameRu, "ru"),
        brand: (a, b) => a.brand.name.localeCompare(b.brand.name, "ru"),
        category: (a, b) => a.category.nameRu.localeCompare(b.category.nameRu, "ru"),
        price: (a, b) => parsePrice(a.priceTjs) - parsePrice(b.priceTjs),
      },
    },
  );

  async function handleDelete(id: string) {
    await adminDeleteProduct(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию, бренду или категории…"
          className="max-w-sm"
        />
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          Добавить товар
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              sortKey="name"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Название
            </SortableHeader>
            <SortableHeader
              sortKey="brand"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Бренд
            </SortableHeader>
            <SortableHeader
              sortKey="category"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Категория
            </SortableHeader>
            <SortableHeader
              sortKey="price"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Цена
            </SortableHeader>
            <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
              Статус
            </TableCell>
            <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
              Действия
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-[var(--secondary)]">
                Ничего не найдено.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nameRu}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>{product.category.nameRu}</TableCell>
                <TableCell className="font-[family-name:var(--font-display)] [font-variant-numeric:lining-nums]">
                  {formatPrice(product.priceTjs, "TJS", "ru")}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className={
                        product.isActive
                          ? "size-2 rounded-full bg-[var(--success)]"
                          : "size-2 rounded-full bg-[var(--secondary)]"
                      }
                    />
                    <span className="text-sm text-foreground">
                      {product.isActive ? "Активен" : "Скрыт"}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="px-2 py-1"
                      render={<Link href={`/admin/products/${product.id}/edit`} />}
                      nativeButton={false}
                    >
                      Изменить
                    </Button>
                    <ConfirmDeleteRow onConfirm={() => handleDelete(product.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
