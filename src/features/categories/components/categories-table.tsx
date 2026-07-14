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
import {
  adminDeleteCategory,
  type CategoryWithCount,
} from "@/features/categories/api/admin"

interface CategoriesTableProps {
  categories: CategoryWithCount[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();

  const { query, setQuery, sortKey, sortDir, toggleSort, rows } = useTableState(
    categories,
    {
      defaultSortKey: "name",
      searchableText: (c) => `${c.nameRu} ${c.nameTj} ${c.nameEn} ${c.slug}`,
      sorters: {
        name: (a, b) => a.nameRu.localeCompare(b.nameRu, "ru"),
        slug: (a, b) => a.slug.localeCompare(b.slug),
        count: (a, b) => a._count.products - b._count.products,
      },
    },
  );

  async function handleDelete(id: string) {
    await adminDeleteCategory(id);
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
        <Button render={<Link href="/admin/categories/new" />} nativeButton={false}>
          Добавить категорию
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
              <TableCell colSpan={4} className="py-8 text-center text-[var(--secondary)]">
                Ничего не найдено.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.nameRu}</TableCell>
                <TableCell className="text-[var(--secondary)]">{category.slug}</TableCell>
                <TableCell className="[font-variant-numeric:tabular-nums]">
                  {category._count.products}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="px-2 py-1"
                      render={<Link href={`/admin/categories/${category.id}/edit`} />}
                      nativeButton={false}
                    >
                      Изменить
                    </Button>
                    <DeleteAlertDialog
                      title={`Удалить категорию «${category.nameRu}»?`}
                      description={
                        category._count.products > 0
                          ? `Вместе с категорией будет удалено ${category._count.products} связанных товаров. Это действие необратимо.`
                          : "Это действие необратимо."
                      }
                      onConfirm={() => handleDelete(category.id)}
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
