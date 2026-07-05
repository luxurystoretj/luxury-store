import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export type TrilingualValue<T> = { ru: T; tj: T; en: T };

/**
 * Picks the active-locale value from a Ru/Tj/En trio, falling back to Russian
 * when the locale-specific value is null (nullable trilingual fields only get
 * filled in for some rows).
 */
export function pickLocale<T>(locale: Locale, values: TrilingualValue<T>): T {
  return values[locale] ?? values.ru;
}
