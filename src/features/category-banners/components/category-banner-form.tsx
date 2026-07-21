"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/api/client"
import { FormField } from "@/features/admin/components/form-field"
import { SingleImageUpload } from "@/features/admin/components/single-image-upload"
import {
  adminCreateCategoryBanner,
  adminUpdateCategoryBanner,
} from "@/features/category-banners/api/admin"
import type { CategoryBannerAdmin } from "@/features/category-banners/types"
import type { Category } from "@/features/categories/types"

interface CategoryBannerFormProps {
  banner?: CategoryBannerAdmin;
  categories: Category[];
}

interface FieldErrors {
  categoryId?: string;
  file?: string;
}

export function CategoryBannerForm({ banner, categories }: CategoryBannerFormProps) {
  const router = useRouter();
  const isEdit = Boolean(banner);

  const [categoryId, setCategoryId] = useState(banner?.categoryId ?? "");
  const [sortOrder, setSortOrder] = useState(String(banner?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!categoryId) next.categoryId = "Выберите категорию";
    if (!isEdit && !file) next.file = "Загрузите изображение";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("sortOrder", sortOrder.trim() || "0");
      formData.append("isActive", String(isActive));
      if (file) formData.append("file", file);

      if (banner) {
        await adminUpdateCategoryBanner(banner.id, formData);
      } else {
        await adminCreateCategoryBanner(formData);
      }
      router.refresh();
      router.push("/admin/category-banners");
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? err.message || "Ошибка сохранения. Попробуйте ещё раз."
          : "Ошибка сохранения. Попробуйте ещё раз.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <FormField label="Изображение" htmlFor="banner-image" required error={errors.file}>
        <SingleImageUpload
          currentImageUrl={banner?.imageUrl}
          onFileChosen={setFile}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Категория"
        htmlFor="banner-category"
        required
        error={errors.categoryId}
      >
        <Select
          value={categoryId}
          onValueChange={(next: unknown) => setCategoryId(next as string)}
        >
          <SelectTrigger id="banner-category" aria-invalid={Boolean(errors.categoryId)}>
            <SelectValue>
              {(v: unknown) =>
                categories.find((c) => c.id === v)?.nameRu ?? "Выберите категорию"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.nameRu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Порядок сортировки" htmlFor="banner-sort-order">
        <Input
          id="banner-sort-order"
          type="number"
          min="0"
          step="1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </FormField>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        Активен (виден на сайте)
      </label>

      {serverError && (
        <p className="rounded-sm border border-[var(--error)] bg-[rgba(181,63,63,0.08)] px-3.5 py-3 text-sm text-[var(--error)]">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Сохранить" : "Создать"}
        </Button>
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/category-banners" />}
          nativeButton={false}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
