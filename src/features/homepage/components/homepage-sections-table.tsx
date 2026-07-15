import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { homepageSectionLabel } from "@/features/homepage/lib/section-labels"
import type { HomepageSection } from "@/features/homepage/types"

interface HomepageSectionsTableProps {
  sections: HomepageSection[];
}

// Plain (server-rendered) list — the homepage section set is fixed (hero/about/contacts), so no
// search/sort/add/delete, only a link to each section's edit page keyed by sectionKey.
export function HomepageSectionsTable({ sections }: HomepageSectionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
            Раздел
          </TableCell>
          <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
            Статус
          </TableCell>
          <TableCell className="text-[11px] font-semibold tracking-[0.12em] uppercase">
            Действия
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sections.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="py-8 text-center text-[var(--secondary)]">
              Разделы не найдены.
            </TableCell>
          </TableRow>
        ) : (
          sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell>{homepageSectionLabel(section.sectionKey)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2 text-sm text-foreground">
                  <span
                    aria-hidden
                    className={`inline-block h-2 w-2 ${
                      section.isActive ? "bg-[var(--success)]" : "bg-[var(--secondary)]"
                    }`}
                  />
                  {section.isActive ? "Активен" : "Скрыт"}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  render={<Link href={`/admin/homepage/${section.sectionKey}`} />}
                  nativeButton={false}
                >
                  Изменить
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
