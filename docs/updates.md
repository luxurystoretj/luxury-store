# Luxury Store — Updates & Amendments

This document logs architectural amendments and decisions. Any rule written here
strictly OVERRIDES the base specification (`docs/luxury-store-specification.md`)
when conflicts occur.

---

**Tech Rule: Next.js 15 Routing** - All dynamic route `params` and `searchParams` across the entire project MUST be treated as asynchronous (e.g., `await params`) to comply with Next.js 15 breaking changes.

**DB Schema Change: Product.color** - Added an optional `color` (String?) column to the `products` table (extends base spec section 2.4). The `GET /api/products` `color` filter now queries this dedicated column with a case-insensitive partial match (`contains`), replacing the previous hack that searched the `name` / `description` fields. Colors are stored in Russian (e.g. "Чёрный", "Тёмно-синий") to match the site content language.
