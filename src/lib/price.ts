import type { Locale } from "@/lib/locale";

export type Currency = "TJS" | "USD";

/** Parses a Prisma Decimal-as-string price into a number for math/formatting. */
export function parsePrice(value: string): number {
  return Number(value);
}

export function formatPrice(value: string | number, currency: Currency, locale: Locale): string {
  const amount = typeof value === "string" ? parsePrice(value) : value;
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
