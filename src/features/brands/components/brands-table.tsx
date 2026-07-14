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
import { DeleteAlertDialog } from "@/features/admin/components/delete-alert-dialog"
import { useTableState } from "@/features/admin/lib/use-table-state"
import { adminDeleteBrand, type BrandWithCount } from "@/features/brands/api/admin"

interface BrandsTableProps {
  brands: BrandWithCount[];
}

export function BrandsTable({ brands }: BrandsTableProps) {
  const router = useRouter();

  const { query, setQuery, sortKey, sortDir, toggleSort, rows } = useTableState(
    brands,
    {
      defaultSortKey: "name",
      searchableText: (b) => `${b.name} ${b.slug}`,
      sorters: {
        name: (a, b) => a.name.localeCompare(b.name, "ru"),
        slug: (a, b) => a.slug.localeCompare(b.slug),
        count: (a, b) => a._count.products - b._count.products,
      },
    },
  );

  async function handleDelete(id: string) {
    await adminDeleteBrand(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или slug…"
          className="max-w-sm"
        />
        <Button render={<Link href="/admin/brands/new" />} nativeButton={false}>
          Добавить бренд
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
              Лого
            </TableCell>
            <SortableHeader
              sortKey="name"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Название
            </SortableHeader>
            <SortableHeader
              sortKey="slug"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Slug
            </SortableHeader>
            <SortableHeader
              sortKey="count"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Товаров
            </SortableHeader>
            <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
              Действия
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-[var(--secondary)]">
                Ничего не найдено.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  {brand.logoUrl ? (
                    // Admin-pasted URLs aren't guaranteed to match next/image's remotePatterns allowlist.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logoUrl}
                      alt=""
                      className="h-8 w-16 bg-surface object-contain"
                    />
                  ) : (
                    <div className="h-8 w-16 bg-surface" aria-hidden />
                  )}
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell className="text-[var(--secondary)]">{brand.slug}</TableCell>
                <TableCell className="[font-variant-numeric:tabular-nums]">
                  {brand._count.products}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="px-2 py-1"
                      render={<Link href={`/admin/brands/${brand.id}/edit`} />}
                      nativeButton={false}
                    >
                      Изменить
                    </Button>
                    <DeleteAlertDialog
                      title={`Удалить бренд «${brand.name}»?`}
                      description={
                        brand._count.products > 0
                          ? `Вместе с брендом будет удалено ${brand._count.products} связанных товаров. Это действие необратимо.`
                          : "Это действие необратимо."
                      }
                      onConfirm={() => handleDelete(brand.id)}
                    />
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
