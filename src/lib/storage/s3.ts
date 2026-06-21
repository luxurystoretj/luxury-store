import { S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 storage client (S3-compatible).
 *
 * Configuration comes from environment variables (see docs/updates.md):
 *   - R2_ENDPOINT    account R2 endpoint URL
 *   - S3_KEY         access key id
 *   - S3_SECRET      secret access key
 *   - S3_BUCKET      target bucket name
 *   - R2_PUBLIC_URL  public base URL used to build stored image URLs
 *
 */

// Aggressively sanitize env values: trim whitespace and strip any stray
// quotes. On Windows .env files these invisible characters can corrupt the
// TLS request (SNI mismatch -> handshake failure, alert 40).
const clean = (value: string | undefined): string =>
  (value ?? "").trim().replace(/['"]/g, "");

const endpoint = clean(process.env.R2_ENDPOINT);
const accessKeyId = clean(process.env.S3_KEY);
const secretAccessKey = clean(process.env.S3_SECRET);

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error(
    "R2 storage is not configured: R2_ENDPOINT, S3_KEY and S3_SECRET are required.",
  );
}

export const s3Client = new S3Client({
  // R2 ignores region but the SDK requires a value.
  region: "auto",
  endpoint,
  // Mandatory for Cloudflare R2: path-style requests avoid the virtual-hosted
  // SNI mismatch against the R2 wildcard certificate (TLS handshake, alert 40).
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/** Bucket that stores product images. */
export const S3_BUCKET = clean(process.env.S3_BUCKET);

/** Public base URL used to build the publicly accessible image URL. */
export const R2_PUBLIC_URL = clean(process.env.R2_PUBLIC_URL);
