export const runtime = "nodejs";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { S3_BUCKET, s3Client } from "@/lib/storage/s3";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * DELETE /api/admin/product-images/[id]
 *
 * Admin endpoint to remove a product image: deletes the object from R2 (when
 * an imageKey is present) and then removes the database record.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const image = await prisma.productImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found." },
        { status: 404 },
      );
    }

    // Remove the file from R2 first (only if we know its key).
    if (image.imageKey) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: image.imageKey,
          }),
        );
      } catch (deleteError) {
        console.error("R2 delete failed:", deleteError);
        return NextResponse.json(
          { success: false, message: "Failed to delete image from storage." },
          { status: 500 },
        );
      }
    }

    await prisma.productImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Image not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/product-images/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product image." },
      { status: 500 },
    );
  }
}
