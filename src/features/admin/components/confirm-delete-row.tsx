"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface ConfirmDeleteRowProps {
  onConfirm: () => void | Promise<void>;
  label?: string;
}

// Lightweight inline confirm for reversible actions (product soft-delete). Not a modal —
// the destructive action here just sets isActive:false and can be undone by editing the
// product back to active, so full AlertDialog weight isn't warranted (per owner decision).
export function ConfirmDeleteRow({
  onConfirm,
  label = "Удалить",
}: ConfirmDeleteRowProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (!isConfirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="default"
        className="px-2 py-1 text-[var(--error)] hover:text-[var(--error)]"
        onClick={() => setIsConfirming(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-foreground">Точно?</span>
      <Button
        type="button"
        variant="ghost"
        size="default"
        className="px-2 py-1 text-[var(--error)] hover:text-[var(--error)]"
        disabled={isPending}
        onClick={async () => {
          setIsPending(true);
          await onConfirm();
          setIsPending(false);
          setIsConfirming(false);
        }}
      >
        Да
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="default"
        className="px-2 py-1"
        disabled={isPending}
        onClick={() => setIsConfirming(false)}
      >
        Нет
      </Button>
    </span>
  );
}
