import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for the locale set and routing behavior.
 *
 * Tajik (`tj`) is deferred to Phase 2 — enabling it is a two-line change here
 * (add `"tj"` below) plus a `messages/tj.json` file; the rest of the app reads
 * `routing.locales` so no other code needs to know the list.
 */
export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
});
