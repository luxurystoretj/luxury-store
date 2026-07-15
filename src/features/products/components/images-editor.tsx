"use client"

import { useState } from "react"

import { ApiError } from "@/lib/api/client"
import { ConfirmDeleteRow } from "@/features/admin/components/confirm-delete-row"
import {
  adminDeleteProductImage,
  adminUploadProductImage,
} from "@/features/products/api/admin"
import type { ProductImage } from "@/features/products/types"

interface ImagesEditorProps {
  productId: string;
  initialImages: ProductImage[];
  /** Used as the thumbnail alt in the admin (no next-intl context here for <ProductImage>). */
  productName: string;
}

// Mirror the server-side limits in src/app/api/admin/product-images/route.ts so bad files are
// rejected before any network round-trip.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function sortImages(images: ProductImage[]): ProductImage[] {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder);
}

// Immediate-mutation editor (its own endpoint, not the product form's deferred submit), so it
// only works once a product exists — rendered on the edit page only. Uploads append at the
// end (sortOrder = max + 1); there is no reorder / alt-edit endpoint, so management is
// add + delete. Admin thumbnails use a raw <img> (admin has no NextIntlClientProvider, so
// <ProductImage> would crash), same as the brands table logo thumbnail.
export function ImagesEditor({ productId, initialImages, productName }: ImagesEditorProps) {
  const [images, setImages] = useState<ProductImage[]>(sortImages(initialImages));
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    setError(null);
    setNotice(null);

    const valid: File[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        rejected.push(`${file.name}: неподдерживаемый тип (нужен JPEG, PNG или WebP)`);
      } else if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: размер должен быть от 1 байта до 5 МБ`);
      } else {
        valid.push(file);
      }
    }

    const rejectedMsg = rejected.length > 0 ? rejected.join("; ") : null;
    if (valid.length === 0) {
      setError(rejectedMsg);
      return;
    }

    setIsUploading(true);
    let working = images;
    let nextSort = working.reduce((max, img) => Math.max(max, img.sortOrder), -1) + 1;
    let uploaded = 0;
    try {
      for (const file of valid) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", productId);
        formData.append("sortOrder", String(nextSort));
        const created = await adminUploadProductImage(formData);
        working = sortImages([...working, created]);
        setImages(working);
        nextSort += 1;
        uploaded += 1;
      }
      if (uploaded > 0) setNotice(`Загружено изображений: ${uploaded}.`);
      if (rejectedMsg) setError(rejectedMsg);
    } catch (err) {
      const uploadMsg =
        err instanceof ApiError
          ? err.message
          : "Не удалось загрузить изображение. Попробуйте ещё раз.";
      setError([uploadMsg, rejectedMsg].filter(Boolean).join(" "));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setNotice(null);
    try {
      await adminDeleteProductImage(id);
      setImages((imgs) => imgs.filter((img) => img.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Не удалось удалить изображение. Попробуйте ещё раз.",
      );
    }
  }

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-normal leading-tight text-foreground">
        Изображения
      </h2>

      {images.length === 0 ? (
        <p className="text-sm text-[var(--secondary)]">Пока нет изображений.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <li key={image.id} className="flex flex-col gap-2">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
                {/* Admin thumbnail: raw <img> — admin has no next-intl context for <ProductImage>. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--secondary)] [font-variant-numeric:tabular-nums]">
                  № {image.sortOrder}
                </span>
                <ConfirmDeleteRow onConfirm={() => handleDelete(image.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading}
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="block w-full text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-none file:border file:border-border-default file:bg-transparent file:px-6 file:py-3 file:text-sm file:font-medium file:text-foreground file:transition-colors file:duration-150 hover:file:border-border-hover hover:file:bg-muted disabled:cursor-not-allowed disabled:text-[var(--secondary)]"
        />
        <p className="text-xs text-[var(--secondary)]">
          JPEG, PNG или WebP, до 5 МБ. {isUploading && "Загрузка…"}
        </p>
      </div>

      {error && (
        <p className="rounded-sm border border-[var(--error)] bg-[rgba(181,63,63,0.08)] px-3.5 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-sm border border-[var(--success)] bg-[rgba(90,122,79,0.08)] px-3.5 py-3 text-sm text-[var(--success)]">
          {notice}
        </p>
      )}
    </section>
  );
}
