export const runtime = "nodejs";

import { randomUUID } from "node:crypto";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { R2_PUBLIC_URL, S3_BUCKET, s3Client } from "@/lib/storage/s3";

type RouteContext = { params: Promise<{ id: string }> };

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed image MIME types mapped to their file extension.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * PATCH /api/admin/category-banners/[id]
 *
 * Admin endpoint for partial updates of a category banner. Always expects
 * multipart/form-data (matches the create form, which resends the full
 * current state on every save). `file` is optional — when present, a new
 * image is uploaded to R2 and the old object is deleted after the DB update
 * succeeds. `categoryId`, `sortOrder`, `isActive` are optional individually.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existing = await prisma.categoryBanner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category banner not found." },
        { status: 404 },
      );
    }

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

    const data: Prisma.CategoryBannerUpdateInput = {};

    if (categoryId !== null) {
      if (typeof categoryId !== "string" || !categoryId.trim()) {
        return NextResponse.json(
          { success: false, message: "Field 'categoryId' must be a non-empty string." },
          { status: 400 },
        );
      }
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
      data.category = { connect: { id: categoryId.trim() } };
    }

    if (sortOrderRaw !== null) {
      if (typeof sortOrderRaw !== "string" || !sortOrderRaw.trim()) {
        return NextResponse.json(
          { success: false, message: "Field 'sortOrder' must be a non-negative integer." },
          { status: 400 },
        );
      }
      const parsed = Number.parseInt(sortOrderRaw, 10);
      if (!Number.isInteger(parsed) || parsed < 0) {
        return NextResponse.json(
          { success: false, message: "Field 'sortOrder' must be a non-negative integer." },
          { status: 400 },
        );
      }
      data.sortOrder = parsed;
    }

    if (isActiveRaw !== null) {
      if (isActiveRaw !== "true" && isActiveRaw !== "false") {
        return NextResponse.json(
          { success: false, message: "Field 'isActive' must be 'true' or 'false'." },
          { status: 400 },
        );
      }
      data.isActive = isActiveRaw === "true";
    }

    let previousImageKey: string | null = null;

    if (file !== null) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, message: "Field 'file' must be a file." },
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

      const imageKey = `category-banners/${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

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

      data.imageUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${imageKey}`;
      data.imageKey = imageKey;
      previousImageKey = existing.imageKey;
    }

    const banner = await prisma.categoryBanner.update({
      where: { id },
      data,
      include: { category: true },
    });

    // Only delete the old R2 object after the DB row points at the new one.
    // A failure here is logged and swallowed — the new image is already live
    // and correct; the stale object is just an orphan to clean up later.
    if (previousImageKey) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: previousImageKey }),
        );
      } catch (deleteError) {
        console.error("R2 delete of replaced image failed:", deleteError);
      }
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category banner not found." },
        { status: 404 },
      );
    }

    console.error("PATCH /api/admin/category-banners/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category banner." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/category-banners/[id]
 *
 * Admin endpoint to remove a category banner: deletes the image from R2 and
 * then removes the database record.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const banner = await prisma.categoryBanner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Category banner not found." },
        { status: 404 },
      );
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: banner.imageKey }),
      );
    } catch (deleteError) {
      console.error("R2 delete failed:", deleteError);
      return NextResponse.json(
        { success: false, message: "Failed to delete image from storage." },
        { status: 500 },
      );
    }

    await prisma.categoryBanner.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category banner not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/category-banners/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category banner." },
      { status: 500 },
    );
  }
}
