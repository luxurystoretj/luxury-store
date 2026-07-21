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
 * GET /api/admin/category-banners
 *
 * Admin listing of ALL category banners (no isActive filter), ordered for
 * display, including the full linked category so the table can show its name.
 */
export async function GET() {
  try {
    const banners = await prisma.categoryBanner.findMany({
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error("GET /api/admin/category-banners failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category banners." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/category-banners
 *
 * Admin endpoint to upload a category banner image to Cloudflare R2 and
 * persist the resulting record. Expects multipart/form-data with `file`,
 * `categoryId`, optional `sortOrder` (defaults to append-at-end), and
 * optional `isActive` (defaults to true).
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
    const categoryId = formData.get("categoryId");
    const sortOrderRaw = formData.get("sortOrder");
    const isActiveRaw = formData.get("isActive");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Field 'file' is required and must be a file." },
        { status: 400 },
      );
    }
    if (typeof categoryId !== "string" || !categoryId.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'categoryId' is required." },
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

    // Verify the category exists before uploading to avoid orphaned R2 objects.
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId.trim() },
      select: { id: true },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Invalid categoryId." },
        { status: 400 },
      );
    }

    // Optional sort order; defaults to append-at-end (max existing + 1).
    let sortOrder: number;
    if (typeof sortOrderRaw === "string" && sortOrderRaw.trim()) {
      const parsed = Number.parseInt(sortOrderRaw, 10);
      if (!Number.isInteger(parsed) || parsed < 0) {
        return NextResponse.json(
          { success: false, message: "Field 'sortOrder' must be a non-negative integer." },
          { status: 400 },
        );
      }
      sortOrder = parsed;
    } else {
      const last = await prisma.categoryBanner.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      sortOrder = (last?.sortOrder ?? -1) + 1;
    }

    // Optional isActive, defaults to true.
    let isActive = true;
    if (typeof isActiveRaw === "string" && isActiveRaw.trim()) {
      if (isActiveRaw !== "true" && isActiveRaw !== "false") {
        return NextResponse.json(
          { success: false, message: "Field 'isActive' must be 'true' or 'false'." },
          { status: 400 },
        );
      }
      isActive = isActiveRaw === "true";
    }

    const imageKey = `category-banners/${randomUUID()}.${ext}`;
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

    const banner = await prisma.categoryBanner.create({
      data: {
        categoryId: categoryId.trim(),
        imageUrl,
        imageKey,
        sortOrder,
        isActive,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid categoryId." },
        { status: 400 },
      );
    }

    console.error("POST /api/admin/category-banners failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category banner." },
      { status: 500 },
    );
  }
}
