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
import { adminDeleteCategoryBanner } from "@/features/category-banners/api/admin"
import type { CategoryBannerAdmin } from "@/features/category-banners/types"

interface CategoryBannersTableProps {
  banners: CategoryBannerAdmin[];
}

export function CategoryBannersTable({ banners }: CategoryBannersTableProps) {
  const router = useRouter();

  const { query, setQuery, sortKey, sortDir, toggleSort, rows } = useTableState(
    banners,
    {
      defaultSortKey: "sortOrder",
      searchableText: (b) => b.category.nameRu,
      sorters: {
        category: (a, b) => a.category.nameRu.localeCompare(b.category.nameRu, "ru"),
        sortOrder: (a, b) => a.sortOrder - b.sortOrder,
        isActive: (a, b) => Number(a.isActive) - Number(b.isActive),
      },
    },
  );

  async function handleDelete(id: string) {
    await adminDeleteCategoryBanner(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по категории…"
          className="max-w-sm"
        />
        <Button
          render={<Link href="/admin/category-banners/new" />}
          nativeButton={false}
        >
          Добавить баннер
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
              Изображение
            </TableCell>
            <SortableHeader
              sortKey="category"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Категория
            </SortableHeader>
            <SortableHeader
              sortKey="sortOrder"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Порядок
            </SortableHeader>
            <SortableHeader
              sortKey="isActive"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            >
              Статус
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
            rows.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  {/* Admin thumbnail: raw <img> — admin has no next-intl context for <ProductImage>. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.imageUrl}
                    alt=""
                    className="h-16 w-24 bg-surface object-cover"
                  />
                </TableCell>
                <TableCell>{banner.category.nameRu}</TableCell>
                <TableCell className="[font-variant-numeric:tabular-nums]">
                  {banner.sortOrder}
                </TableCell>
                <TableCell
                  className={
                    banner.isActive ? "text-[var(--success)]" : "text-[var(--secondary)]"
                  }
                >
                  {banner.isActive ? "Активен" : "Скрыт"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="px-2 py-1"
                      render={<Link href={`/admin/category-banners/${banner.id}/edit`} />}
                      nativeButton={false}
                    >
                      Изменить
                    </Button>
                    <DeleteAlertDialog
                      title={`Удалить баннер «${banner.category.nameRu}»?`}
                      description="Это действие необратимо."
                      onConfirm={() => handleDelete(banner.id)}
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
