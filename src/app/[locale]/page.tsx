import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering for this page (Next.js renders pages and layouts
  // independently, so setRequestLocale is needed here too).
  setRequestLocale(locale);

  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-4xl">{t("title")}</h1>
      <p className="max-w-md">{t("tagline")}</p>
    </main>
  );
}
