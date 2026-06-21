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
 * The client is cached on globalThis so it is reused across hot reloads in
 * development instead of being re-created on every request.
 */

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.S3_KEY;
const secretAccessKey = process.env.S3_SECRET;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error(
    "R2 storage is not configured: R2_ENDPOINT, S3_KEY and S3_SECRET are required.",
  );
}

const createS3Client = () =>
  new S3Client({
    // R2 ignores region but the SDK requires a value.
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

const globalForS3 = globalThis as unknown as {
  s3Client: ReturnType<typeof createS3Client> | undefined;
};

export const s3Client = globalForS3.s3Client ?? createS3Client();

if (process.env.NODE_ENV !== "production") {
  globalForS3.s3Client = s3Client;
}

/** Bucket that stores product images. */
export const S3_BUCKET = process.env.S3_BUCKET ?? "";

/** Public base URL used to build the publicly accessible image URL. */
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";
