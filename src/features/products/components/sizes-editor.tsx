"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SizePayload } from "@/features/products/api/admin"

interface SizesEditorProps {
  sizes: SizePayload[];
  onChange: (sizes: SizePayload[]) => void;
}

// Inline size editor for the product form (not a separate route). New rows append below
// existing ones; delete is immediate (no confirm) since the whole form is still
// pre-save/cancelable at this point. On submit the full current array is sent as-is —
// PATCH replaces the whole set when the `sizes` key is present.
export function SizesEditor({ sizes, onChange }: SizesEditorProps) {
  function updateRow(index: number, patch: Partial<SizePayload>) {
    onChange(sizes.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    onChange(sizes.filter((_, i) => i !== index));
  }

  function addRow() {
    onChange([...sizes, { size: "", quantity: 0 }]);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase">
        Размеры
      </span>

      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          {sizes.map((row, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                value={row.size}
                onChange={(e) => updateRow(index, { size: e.target.value })}
                placeholder="Размер"
                aria-label="Размер"
                className="max-w-[120px]"
              />
              <Input
                type="number"
                min={0}
                step={1}
                value={row.quantity}
                onChange={(e) =>
                  updateRow(index, { quantity: Math.max(0, Number(e.target.value) || 0) })
                }
                placeholder="Кол-во"
                aria-label="Количество"
                className="max-w-[100px] [font-variant-numeric:tabular-nums]"
              />
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-[var(--error)] hover:text-[var(--error)]"
                onClick={() => removeRow(index)}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="outline" className="w-fit" onClick={addRow}>
        Добавить размер
      </Button>
    </div>
  );
}
