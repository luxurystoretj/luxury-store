import { notFound } from "next/navigation"

// Catch-all for any path under [locale] that doesn't match a real route.
// Without this, Next can't tell the request belongs to the [locale] segment
// tree at all, and falls back to its own default 404 instead of the
// localized [locale]/not-found.tsx boundary.
export default function CatchAll() {
  notFound()
}
