export const runtime = "nodejs";

import { randomUUID } from "node:crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { R2_PUBLIC_URL, S3_BUCKET, s3Client } from "@/lib/storage/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed image MIME types mapped to their file extension.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * POST /api/admin/product-images
 *
 * Admin endpoint to upload a product image to Cloudflare R2 and persist the
 * resulting record. Expects multipart/form-data with `file`, `productId` and
 * an optional `sortOrder`.
 */
export async function POST(request: Request) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, message: "Expected multipart/form-data body." },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    const productId = formData.get("productId");
    const sortOrderRaw = formData.get("sortOrder");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Field 'file' is required and must be a file." },
        { status: 400 },
      );
    }
    if (typeof productId !== "string" || !productId.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'productId' is required." },
        { status: 400 },
      );
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported file type. Allowed: jpeg, png, webp.",
        },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File must be between 1 byte and 5 MB." },
        { status: 400 },
      );
    }

    // Optional sort order, defaults to 0.
    let sortOrder = 0;
    if (typeof sortOrderRaw === "string" && sortOrderRaw.trim()) {
      const parsed = Number.parseInt(sortOrderRaw, 10);
      if (!Number.isInteger(parsed) || parsed < 0) {
        return NextResponse.json(
          { success: false, message: "Field 'sortOrder' must be a non-negative integer." },
          { status: 400 },
        );
      }
      sortOrder = parsed;
    }

    // Verify the product exists before uploading to avoid orphaned R2 objects.
    const productExists = await prisma.product.findUnique({
      where: { id: productId.trim() },
      select: { id: true },
    });
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: "Invalid productId." },
        { status: 400 },
      );
    }

    const imageKey = `products/${productId.trim()}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2.
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: imageKey,
          Body: buffer,
          ContentType: file.type,
        }),
      );
    } catch (uploadError) {
      console.error("R2 upload failed:", uploadError);
      return NextResponse.json(
        { success: false, message: "Failed to upload image." },
        { status: 500 },
      );
    }

    const imageUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${imageKey}`;

    const image = await prisma.productImage.create({
      data: {
        productId: productId.trim(),
        imageUrl,
        imageKey,
        sortOrder,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid productId." },
        { status: 400 },
      );
    }

    console.error("POST /api/admin/product-images failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product image." },
      { status: 500 },
    );
  }
}
