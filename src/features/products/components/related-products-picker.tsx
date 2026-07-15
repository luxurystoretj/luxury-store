"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api/client"
import { ConfirmDeleteRow } from "@/features/admin/components/confirm-delete-row"
import {
  adminCreateRelation,
  adminDeleteRelation,
  adminGetProductClient,
} from "@/features/products/api/admin"
import type { Product, RelatedProductLink } from "@/features/products/types"

interface RelatedProductsPickerProps {
  productId: string;
  initialLinks: RelatedProductLink[];
  candidates: Product[];
}

// One linked entry, keyed to the FORWARD relation (this product → related). The forward
// direction is what this product's PDP block and edit view represent, so it drives the list;
// the reverse direction is kept in sync best-effort.
interface LinkedItem {
  linkId: string; // forward relation id — used for DELETE
  productId: string; // the related product's id
  nameRu: string;
  imageUrl: string | null;
}

function toLinkedItem(link: RelatedProductLink): LinkedItem {
  return {
    linkId: link.id,
    productId: link.relatedProductId,
    nameRu: link.relatedProduct.nameRu,
    imageUrl: link.relatedProduct.images[0]?.imageUrl ?? null,
  };
}

function Thumb({ imageUrl, alt }: { imageUrl: string | null; alt: string }) {
  if (!imageUrl) return <div className="h-12 w-12 shrink-0 bg-surface" aria-hidden />;
  // Admin thumbnail: raw <img> — admin has no next-intl context for <ProductImage>.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageUrl} alt={alt} className="h-12 w-12 shrink-0 bg-surface object-cover" />;
}

export function RelatedProductsPicker({
  productId,
  initialLinks,
  candidates,
}: RelatedProductsPickerProps) {
  const [links, setLinks] = useState<LinkedItem[]>(initialLinks.map(toLinkedItem));
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const linkedIds = new Set(links.map((l) => l.productId));
  const q = query.trim().toLowerCase();
  const available = candidates.filter((c) => c.id !== productId && !linkedIds.has(c.id));
  const filtered =
    q === ""
      ? available
      : available.filter(
          (c) =>
            c.nameRu.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q),
        );

  // Add pairing X↔Y: create X→Y, then Y→X. 409 (already exists) is benign. The local list
  // reflects the forward relation; a reverse-only failure still records the forward and warns.
  async function handleAdd(candidate: Product) {
    setError(null);
    setBusyId(candidate.id);
    try {
      let forward;
      try {
        forward = await adminCreateRelation({
          productId,
          relatedProductId: candidate.id,
        });
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError("Эта связь уже существует.");
          return;
        }
        throw err;
      }

      let reverseFailed = false;
      try {
        await adminCreateRelation({ productId: candidate.id, relatedProductId: productId });
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 409)) reverseFailed = true;
      }

      setLinks((prev) => [
        ...prev,
        {
          linkId: forward.id,
          productId: candidate.id,
          nameRu: candidate.nameRu,
          imageUrl: candidate.images[0]?.imageUrl ?? null,
        },
      ]);
      if (reverseFailed) {
        setError(
          "Товар добавлен, но обратную связь создать не удалось. Откройте связанный товар и проверьте.",
        );
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Не удалось добавить связь. Попробуйте ещё раз.",
      );
    } finally {
      setBusyId(null);
    }
  }

  // Remove pairing X↔Y: delete forward X→Y (id known), then discover and delete the reverse
  // Y→X from the related product's own detail. 404 (already gone) is benign. If the forward
  // deletes but reverse cleanup fails, the forward removal still stands and we warn.
  async function handleRemove(item: LinkedItem) {
    setError(null);
    setBusyId(item.productId);
    try {
      try {
        await adminDeleteRelation(item.linkId);
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 404)) throw err;
      }

      let reverseFailed = false;
      try {
        const detail = await adminGetProductClient(item.productId);
        const reverse = detail.relatedFrom.find((l) => l.relatedProductId === productId);
        if (reverse) await adminDeleteRelation(reverse.id);
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 404)) reverseFailed = true;
      }

      setLinks((prev) => prev.filter((l) => l.productId !== item.productId));
      if (reverseFailed) {
        setError(
          "Связь удалена, но обратную сторону удалить не удалось. Откройте связанный товар и проверьте.",
        );
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Не удалось удалить связь. Попробуйте ещё раз.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-normal leading-tight text-foreground">
        Сочетается с этим
      </h2>
      <p className="text-sm text-[var(--secondary)]">
        Эти товары показываются в блоке «Сочетается с этим» на странице товара. Связь
        двусторонняя — добавление и удаление здесь затрагивает оба товара.
      </p>

      {links.length === 0 ? (
        <p className="text-sm text-[var(--secondary)]">Пока нет связанных товаров.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border-subtle border border-border-default">
          {links.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 p-2">
              <Thumb imageUrl={item.imageUrl} alt={item.nameRu} />
              <span className="flex-1 text-sm text-foreground">{item.nameRu}</span>
              <ConfirmDeleteRow onConfirm={() => handleRemove(item)} label="Убрать" />
            </li>
          ))}
        </ul>
      )}

      <div>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button type="button" variant="outline">
                Добавить товар
              </Button>
            }
          />
          <AlertDialogContent className="flex max-h-[80vh] max-w-lg flex-col">
            <AlertDialogHeader>
              <AlertDialogTitle>Добавить связанный товар</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="mt-4 flex min-h-0 flex-col gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию или slug…"
              />
              <ul className="flex max-h-80 flex-col divide-y divide-border-subtle overflow-y-auto border border-border-default">
                {filtered.length === 0 ? (
                  <li className="p-3 text-sm text-[var(--secondary)]">Ничего не найдено.</li>
                ) : (
                  filtered.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 p-2">
                      <Thumb imageUrl={c.images[0]?.imageUrl ?? null} alt={c.nameRu} />
                      <span className="flex-1 text-sm text-foreground">{c.nameRu}</span>
                      <Button
                        type="button"
                        variant="outline"
                        className="px-3 py-1.5"
                        disabled={busyId === c.id}
                        onClick={() => handleAdd(c)}
                      >
                        Добавить
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <AlertDialogFooter>
              <AlertDialogClose
                render={
                  <Button type="button" variant="outline">
                    Закрыть
                  </Button>
                }
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {error && (
        <p className="rounded-sm border border-[var(--error)] bg-[rgba(181,63,63,0.08)] px-3.5 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}
    </section>
  );
}
