"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/api/client"
import { FormField } from "@/features/admin/components/form-field"
import { TrilingualField } from "@/features/admin/components/trilingual-field"
import { adminUpdateHomepageSection } from "@/features/homepage/api/admin"
import type { HomepageSection } from "@/features/homepage/types"

interface HomepageSectionFormProps {
  section: HomepageSection;
}

// One shared form for all three sections — their field sets don't diverge (each uses
// title/subtitle + imageUrl + isActive; videoUrl is offered too since the column/PATCH support
// it, though no section currently sets it). All text fields are nullable per schema, so blanks
// round-trip to null. Always resends the full current state (like the product/brand forms), so
// PATCH's partial-update semantics never accidentally clear an untouched field.
export function HomepageSectionForm({ section }: HomepageSectionFormProps) {
  const router = useRouter();

  const [titles, setTitles] = useState({
    ru: section.titleRu ?? "",
    tj: section.titleTj ?? "",
    en: section.titleEn ?? "",
  });
  const [subtitles, setSubtitles] = useState({
    ru: section.subtitleRu ?? "",
    tj: section.subtitleTj ?? "",
    en: section.subtitleEn ?? "",
  });
  const [imageUrl, setImageUrl] = useState(section.imageUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(section.videoUrl ?? "");
  const [isActive, setIsActive] = useState(section.isActive);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setIsSubmitting(true);
    try {
      await adminUpdateHomepageSection({
        sectionKey: section.sectionKey,
        titleRu: titles.ru.trim() || null,
        titleTj: titles.tj.trim() || null,
        titleEn: titles.en.trim() || null,
        subtitleRu: subtitles.ru.trim() || null,
        subtitleTj: subtitles.tj.trim() || null,
        subtitleEn: subtitles.en.trim() || null,
        imageUrl: imageUrl.trim() || null,
        videoUrl: videoUrl.trim() || null,
        isActive,
      });
      router.refresh();
      router.push("/admin/homepage");
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
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <TrilingualField
        legend="Заголовок"
        idPrefix="section-title"
        values={titles}
        onChange={(lang, value) => setTitles((v) => ({ ...v, [lang]: value }))}
      />

      <TrilingualField
        legend="Подзаголовок"
        multiline
        idPrefix="section-subtitle"
        values={subtitles}
        onChange={(lang, value) => setSubtitles((v) => ({ ...v, [lang]: value }))}
      />

      <FormField label="URL изображения" htmlFor="section-image-url">
        <Input
          id="section-image-url"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
        />
      </FormField>

      <FormField label="URL видео" htmlFor="section-video-url">
        <Input
          id="section-video-url"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://…"
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
          Сохранить
        </Button>
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/homepage" />}
          nativeButton={false}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
