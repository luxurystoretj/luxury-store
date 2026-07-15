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
import { parsePrice } from "@/lib/price"
import { FormField } from "@/features/admin/components/form-field"
import { TrilingualField } from "@/features/admin/components/trilingual-field"
import { adminCreateProduct, adminUpdateProduct } from "@/features/products/api/admin"
import type { SizePayload, ProductPayload } from "@/features/products/api/admin"
import type { Product } from "@/features/products/types"
import { SizesEditor } from "@/features/products/components/sizes-editor"
import type { Brand } from "@/features/brands/types"
import type { Category } from "@/features/categories/types"

interface ProductFormProps {
  product?: Product;
  brands: Brand[];
  categories: Category[];
}

interface FieldErrors {
  nameRu?: string;
  nameTj?: string;
  nameEn?: string;
  slug?: string;
  brandId?: string;
  categoryId?: string;
  priceTjs?: string;
  priceUsd?: string;
  sizes?: string;
}

export function ProductForm({ product, brands, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [names, setNames] = useState({
    ru: product?.nameRu ?? "",
    tj: product?.nameTj ?? "",
    en: product?.nameEn ?? "",
  });
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [priceTjs, setPriceTjs] = useState(
    product ? String(parsePrice(product.priceTjs)) : "",
  );
  const [priceUsd, setPriceUsd] = useState(
    product ? String(parsePrice(product.priceUsd)) : "",
  );
  const [descriptions, setDescriptions] = useState({
    ru: product?.descriptionRu ?? "",
    tj: product?.descriptionTj ?? "",
    en: product?.descriptionEn ?? "",
  });
  const [compositions, setCompositions] = useState({
    ru: product?.compositionRu ?? "",
    tj: product?.compositionTj ?? "",
    en: product?.compositionEn ?? "",
  });
  const [colors, setColors] = useState({
    ru: product?.colorRu ?? "",
    tj: product?.colorTj ?? "",
    en: product?.colorEn ?? "",
  });
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [sizes, setSizes] = useState<SizePayload[]>(
    product?.sizes.map((s) => ({ size: s.size, quantity: s.quantity })) ?? [],
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!names.ru.trim()) next.nameRu = "Обязательное поле";
    if (!names.tj.trim()) next.nameTj = "Обязательное поле";
    if (!names.en.trim()) next.nameEn = "Обязательное поле";
    if (!slug.trim()) next.slug = "Обязательное поле";
    if (!brandId) next.brandId = "Выберите бренд";
    if (!categoryId) next.categoryId = "Выберите категорию";

    const priceTjsNum = Number(priceTjs);
    if (priceTjs.trim() === "" || Number.isNaN(priceTjsNum) || priceTjsNum < 0) {
      next.priceTjs = "Введите корректную цену";
    }
    const priceUsdNum = Number(priceUsd);
    if (priceUsd.trim() === "" || Number.isNaN(priceUsdNum) || priceUsdNum < 0) {
      next.priceUsd = "Введите корректную цену";
    }
    if (sizes.some((row) => !row.size.trim())) {
      next.sizes = "У каждого размера должно быть название";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: ProductPayload = {
        nameRu: names.ru.trim(),
        nameTj: names.tj.trim(),
        nameEn: names.en.trim(),
        slug: slug.trim(),
        brandId,
        categoryId,
        priceTjs: Number(priceTjs),
        priceUsd: Number(priceUsd),
        descriptionRu: descriptions.ru.trim() || null,
        descriptionTj: descriptions.tj.trim() || null,
        descriptionEn: descriptions.en.trim() || null,
        compositionRu: compositions.ru.trim() || null,
        compositionTj: compositions.tj.trim() || null,
        compositionEn: compositions.en.trim() || null,
        colorRu: colors.ru.trim() || null,
        colorTj: colors.tj.trim() || null,
        colorEn: colors.en.trim() || null,
        isActive,
        isFeatured,
        isNew,
        sizes: sizes.map((row) => ({ size: row.size.trim(), quantity: row.quantity })),
      };

      if (product) {
        await adminUpdateProduct(product.id, payload);
        router.refresh();
        router.push("/admin/products");
      } else {
        // Redirect to the new product's edit page so images / related products (which need an
        // existing productId) can be added right after creation.
        const created = await adminCreateProduct(payload);
        router.refresh();
        router.push(`/admin/products/${created.id}/edit`);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setServerError("Товар с таким slug уже существует.");
      } else if (err instanceof ApiError) {
        setServerError(err.message || "Ошибка сохранения. Попробуйте ещё раз.");
      } else {
        setServerError("Ошибка сохранения. Попробуйте ещё раз.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-8">
      <TrilingualField
        legend="Название"
        required
        idPrefix="product-name"
        values={names}
        onChange={(lang, value) => setNames((v) => ({ ...v, [lang]: value }))}
        errors={{ ru: errors.nameRu, tj: errors.nameTj, en: errors.nameEn }}
      />

      <FormField label="Slug" htmlFor="product-slug" required error={errors.slug}>
        <Input
          id="product-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          aria-invalid={Boolean(errors.slug)}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Бренд" htmlFor="product-brand" required error={errors.brandId}>
          <Select
            value={brandId}
            onValueChange={(next: unknown) => setBrandId(next as string)}
          >
            <SelectTrigger id="product-brand" aria-invalid={Boolean(errors.brandId)}>
              <SelectValue>
                {(v: unknown) => brands.find((b) => b.id === v)?.name ?? "Выберите бренд"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Категория"
          htmlFor="product-category"
          required
          error={errors.categoryId}
        >
          <Select
            value={categoryId}
            onValueChange={(next: unknown) => setCategoryId(next as string)}
          >
            <SelectTrigger id="product-category" aria-invalid={Boolean(errors.categoryId)}>
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
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Цена, TJS"
          htmlFor="product-price-tjs"
          required
          error={errors.priceTjs}
        >
          <Input
            id="product-price-tjs"
            type="number"
            min={0}
            step="0.01"
            value={priceTjs}
            onChange={(e) => setPriceTjs(e.target.value)}
            aria-invalid={Boolean(errors.priceTjs)}
          />
        </FormField>
        <FormField
          label="Цена, USD"
          htmlFor="product-price-usd"
          required
          error={errors.priceUsd}
        >
          <Input
            id="product-price-usd"
            type="number"
            min={0}
            step="0.01"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            aria-invalid={Boolean(errors.priceUsd)}
          />
        </FormField>
      </div>

      <TrilingualField
        legend="Описание"
        multiline
        idPrefix="product-description"
        values={descriptions}
        onChange={(lang, value) => setDescriptions((v) => ({ ...v, [lang]: value }))}
      />

      <TrilingualField
        legend="Состав"
        multiline
        idPrefix="product-composition"
        values={compositions}
        onChange={(lang, value) => setCompositions((v) => ({ ...v, [lang]: value }))}
      />

      <TrilingualField
        legend="Цвет"
        idPrefix="product-color"
        values={colors}
        onChange={(lang, value) => setColors((v) => ({ ...v, [lang]: value }))}
      />

      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase">
          Флаги
        </span>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          Активен (виден на сайте)
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          Рекомендуемый
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <Switch checked={isNew} onCheckedChange={setIsNew} />
          Новинка
        </label>
      </div>

      <SizesEditor sizes={sizes} onChange={setSizes} />
      {errors.sizes && <p className="text-sm text-[var(--error)]">{errors.sizes}</p>}

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
          render={<Link href="/admin/products" />}
          nativeButton={false}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
