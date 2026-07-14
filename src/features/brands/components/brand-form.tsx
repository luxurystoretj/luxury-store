"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api/client"
import { FormField } from "@/features/admin/components/form-field"
import { TrilingualField } from "@/features/admin/components/trilingual-field"
import { adminCreateBrand, adminUpdateBrand } from "@/features/brands/api/admin"
import type { Brand } from "@/features/brands/types"

interface BrandFormProps {
  brand?: Brand;
}

interface FieldErrors {
  name?: string;
  slug?: string;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const isEdit = Boolean(brand);

  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [descriptions, setDescriptions] = useState({
    ru: brand?.descriptionRu ?? "",
    tj: brand?.descriptionTj ?? "",
    en: brand?.descriptionEn ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Обязательное поле";
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
        name: name.trim(),
        slug: slug.trim(),
        logoUrl: logoUrl.trim() || null,
        descriptionRu: descriptions.ru.trim() || null,
        descriptionTj: descriptions.tj.trim() || null,
        descriptionEn: descriptions.en.trim() || null,
      };
      if (brand) {
        await adminUpdateBrand(brand.id, payload);
      } else {
        await adminCreateBrand(payload);
      }
      router.refresh();
      router.push("/admin/brands");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setServerError("Бренд с таким slug уже существует.");
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
      <FormField label="Название" htmlFor="brand-name" required error={errors.name}>
        <Input
          id="brand-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </FormField>

      <FormField label="Slug" htmlFor="brand-slug" required error={errors.slug}>
        <Input
          id="brand-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          aria-invalid={Boolean(errors.slug)}
        />
      </FormField>

      <FormField label="URL логотипа" htmlFor="brand-logo-url">
        <Input
          id="brand-logo-url"
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://…"
        />
      </FormField>

      <TrilingualField
        legend="Описание"
        multiline
        idPrefix="brand-description"
        values={descriptions}
        onChange={(lang, value) => setDescriptions((v) => ({ ...v, [lang]: value }))}
      />

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
          render={<Link href="/admin/brands" />}
          nativeButton={false}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
