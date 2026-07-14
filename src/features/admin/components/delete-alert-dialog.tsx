"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteAlertDialogProps {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  trigger?: React.ReactElement;
}

// Full modal confirm for irreversible hard deletes (brand/category — cascade-delete their
// products at the DB level, per owner decision). `description` carries the cascade-count
// warning built by the caller from _count.products.
export function DeleteAlertDialog({
  title,
  description,
  onConfirm,
  trigger,
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          trigger ?? (
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="px-2 py-1 text-[var(--error)] hover:text-[var(--error)]"
            >
              Удалить
            </Button>
          )
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={async () => {
              setIsPending(true);
              await onConfirm();
              setIsPending(false);
              setOpen(false);
            }}
          >
            Удалить
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
