import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. Use these instead of `next/link` and
 * `next/navigation` so links and redirects carry the active locale prefix
 * automatically (needed by the locale switcher and all in-app navigation).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
