"use client"

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { TableHead } from "@/components/ui/table"
import { UIIcon } from "@/components/ui/ui-icon"
import { cn } from "@/lib/utils"
import type { SortDir } from "@/features/admin/lib/use-table-state"

interface SortableHeaderProps {
  sortKey: string;
  activeSortKey: string;
  sortDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function SortableHeader({
  sortKey,
  activeSortKey,
  sortDir,
  onSort,
  className,
  children,
}: SortableHeaderProps) {
  const isActive = sortKey === activeSortKey;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1.5 uppercase outline-none transition-colors duration-150 ease-out hover:text-[var(--accent)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isActive && "text-[var(--accent)]"
        )}
      >
        {children}
        {isActive && (
          <UIIcon
            icon={sortDir === "asc" ? ChevronUpIcon : ChevronDownIcon}
            size={16}
          />
        )}
      </button>
    </TableHead>
  );
}
