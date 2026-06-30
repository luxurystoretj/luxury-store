# Luxury Store — Updates & Amendments

This document logs architectural amendments and decisions. Any rule written here
strictly OVERRIDES the base specification (`docs/luxury-store-specification.md`)
when conflicts occur.

---

**Tech Rule: Next.js 15 Routing** - All dynamic route `params` and `searchParams` across the entire project MUST be treated as asynchronous (e.g., `await params`) to comply with Next.js 15 breaking changes.

**DB Schema Change: Product.color** - Added an optional `color` (String?) column to the `products` table (extends base spec section 2.4). The `GET /api/products` `color` filter now queries this dedicated column with a case-insensitive partial match (`contains`), replacing the previous hack that searched the `name` / `description` fields. Colors are stored in Russian (e.g. "Чёрный", "Тёмно-синий") to match the site content language.

**Auth Decision: Custom Cookie-based Admin Auth** - For the MVP we use a minimal custom auth system instead of NextAuth (permitted by base spec section 3.4). A single ADMIN role authenticates via the `ADMIN_PASS` environment variable. `POST /api/auth/login` validates the password and, on success, sets an HTTP-only, secure cookie named `admin_token` (24h expiration). All `/api/admin/*` routes are protected by `src/middleware.ts`, which rejects requests without a valid `admin_token` cookie (401, standard JSON error). Required env variable: `ADMIN_PASS`.

**File Storage: Cloudflare R2** - Product images are stored in Cloudflare R2 (S3-compatible) per base spec section 5.2, accessed via the `@aws-sdk/client-s3` package. The `ProductImage` model gains an optional `image_key` column (`imageKey String?`) that stores the R2 object key so images can be deleted from the bucket later (the column is optional so existing seeded image rows remain valid). Required env variables (extends base spec section 5.4): `S3_BUCKET`, `S3_KEY`, `S3_SECRET`, `R2_ENDPOINT` (account R2 endpoint URL), `R2_PUBLIC_URL` (public base URL used to build the stored image URL).

**i18n: Trilingual column-based fields (RU/TJ/EN)** - All translatable text fields use three columns with `_ru`, `_tj`, `_en` suffixes instead of a single column (extends/overrides base spec sections 2.2–2.8). Affected fields: `Category.name` → `name_ru/tj/en` (required); `Brand.description` → `description_ru/tj/en` (optional, `Brand.name` stays single); `Product.name` → `name_ru/tj/en` (required), `Product.description` / `composition` / `color` → `*_ru/tj/en` (optional); `HomepageSection.title` / `subtitle` → `*_ru/tj/en` (optional). Prisma field names are camelCase (`nameRu`) mapped to snake_case columns (`name_ru`), so JSON API keys are camelCase. Public `GET /api/products`: `search` matches across `name_ru/tj/en` + `description_ru/tj/en`; `color` matches across `color_ru/tj/en`. List ordering that previously used `name` now uses `name_ru` (categories; `Brand.name` is unchanged so brands still order by `name`).

**Images: LQIP reserved, trilingual alt text** - Per the frontend design system (DESIGN.md §8), the `ProductImage` model gains image-loading/accessibility fields. `blurDataURL` (`String?`, mapped `blur_data_url`) is **reserved in the schema but NOT populated by the backend** for the MVP — base64 LQIP generation (sharp/plaiceholder) is deferred; the API leaves it `null` and the frontend falls back to a flat skeleton. Alt text follows the trilingual convention: `altRu`, `altTj`, `altEn` (`String?`, mapped `alt_ru`/`alt_tj`/`alt_en`), accepted by `POST /api/admin/product-images` via multipart form fields. All four fields are optional so existing image rows remain valid.

---

## Known MVP Limitations

These are accepted trade-offs for the MVP and should be hardened before production:

- **Auth token is static, no server-side expiry.** The `admin_token` cookie value is a deterministic `SHA-256(ADMIN_PASS)`. The 24h lifetime is enforced only by the browser cookie `maxAge`; the server accepts the raw value until `ADMIN_PASS` rotates, so a leaked cookie is replayable. Future fix: sign a payload (with an `exp` claim) using a dedicated `AUTH_SECRET` (HMAC) and verify expiry server-side.
- **No brute-force protection on login.** `POST /api/auth/login` has no rate limiting, and the password is compared with `===` (not constant-time). Future fix: add rate limiting and use a constant-time comparison.

---

## Strict Rules

**R2 Upload SSL Errors** - If an `SSL alert 40` or `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` error occurs during file uploads to Cloudflare R2, DO NOT touch or modify the code. You must contact the backend developer immediately.
