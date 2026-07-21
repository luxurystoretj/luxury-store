"use client"

import { useEffect, useState } from "react"

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from "@/features/admin/lib/upload-constants"

interface SingleImageUploadProps {
  /** Existing image URL (edit mode). Shown until a new file is picked. */
  currentImageUrl?: string | null;
  /** Called with the validated File, or null when the selection is cleared/invalid. */
  onFileChosen: (file: File | null) => void;
  disabled?: boolean;
}

// One-image-in, one-image-out control: no gallery, no sortOrder tiles — unlike
// ImagesEditor (which manages a product's whole image collection), a banner
// has exactly one image that gets replaced wholesale. Picking a new file only
// stages it locally (preview via a local object URL); the parent form decides
// when to actually submit it via adminCreateCategoryBanner/adminUpdateCategoryBanner.
export function SingleImageUpload({
  currentImageUrl,
  onFileChosen,
  disabled,
}: SingleImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Revoke the object URL when it's replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    setError(null);

    if (!file) {
      onFileChosen(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Неподдерживаемый тип файла (нужен JPEG, PNG или WebP).");
      onFileChosen(null);
      return;
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_FILE_SIZE) {
      setError("Размер файла должен быть от 1 байта до 5 МБ.");
      onFileChosen(null);
      return;
    }

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onFileChosen(file);
  }

  const displayUrl = previewUrl ?? currentImageUrl ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-surface">
        {displayUrl ? (
          // Admin preview: raw <img> — admin has no next-intl context for <ProductImage>,
          // and a freshly-picked file's preview is a local blob: URL besides.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[var(--secondary)]">
            Нет изображения
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={(e) => {
          handleChange(e.target.files);
          e.target.value = "";
        }}
        className="block w-full text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-none file:border file:border-border-default file:bg-transparent file:px-6 file:py-3 file:text-sm file:font-medium file:text-foreground file:transition-colors file:duration-150 hover:file:border-border-hover hover:file:bg-muted disabled:cursor-not-allowed disabled:text-[var(--secondary)]"
      />
      <p className="text-xs text-[var(--secondary)]">JPEG, PNG или WebP, до 5 МБ.</p>

      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}
