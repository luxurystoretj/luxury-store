import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// R2_PUBLIC_URL is required in every environment for real product images (parallel to
// NEXT_PUBLIC_APP_URL in src/lib/api/client.ts) — soft-guarded so a missing var only
// drops the R2 host from the allowlist instead of failing the build.
const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // placehold.co (seed data, see prisma/seed.ts) serves SVG by default, which Next
    // blocks unless explicitly allowed — real R2 product photos are always raster and
    // unaffected. CSP is Next's own recommended mitigation for this flag.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    remotePatterns: [
      // Seed/dev placeholder images only.
      { protocol: "https", hostname: "placehold.co" },
      ...(r2Host
        ? [{ protocol: "https" as const, hostname: r2Host, pathname: "/**" }]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);
