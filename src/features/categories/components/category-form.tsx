"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api/client"
import { FormField } from "@/features/admin/components/form-field"
import { TrilingualField, type Lang } from "@/features/admin/components/trilingual-field"
import { adminCreateCategory, adminUpdateCategory } from "@/features/categories/api/admin"
import type { Category } from "@/features/categories/types"

interface CategoryFormProps {
  category?: Category;
}

type FieldErrors = Partial<Record<Lang | "slug", string>>;

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(category);

  const [names, setNames] = useState({
    ru: category?.nameRu ?? "",
    tj: category?.nameTj ?? "",
    en: category?.nameEn ?? "",
  });
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!names.ru.trim()) next.ru = "Обязательное поле";
    if (!names.tj.trim()) next.tj = "Обязательное поле";
    if (!names.en.trim()) next.en = "Обязательное поле";
    if (!slug.trim()) next.slug = "Обязательное поле";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nameRu: names.ru.trim(),
        nameTj: names.tj.trim(),
        nameEn: names.en.trim(),
        slug: slug.trim(),
      };
      if (category) {
        await adminUpdateCategory(category.id, payload);
      } else {
        await adminCreateCategory(payload);
      }
      router.refresh();
      router.push("/admin/categories");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setServerError("Категория с таким slug уже существует.");
      } else if (err instanceof ApiError) {
        setServerError(err.message || "Ошибка сохранения. Попробуйте ещё раз.");
      } else {
        setServerError("Ошибка сохранения. Попробуйте ещё раз.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <TrilingualField
        legend="Название"
        required
        idPrefix="category-name"
        values={names}
        onChange={(lang, value) => setNames((v) => ({ ...v, [lang]: value }))}
        errors={{ ru: errors.ru, tj: errors.tj, en: errors.en }}
      />

      <FormField label="Slug" htmlFor="category-slug" required error={errors.slug}>
        <Input
          id="category-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          aria-invalid={Boolean(errors.slug)}
        />
      </FormField>

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
          render={<Link href="/admin/categories" />}
          nativeButton={false}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
