import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { parseSizes, type SizeInput } from "@/lib/utils/product";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/products/[id]
 *
 * Admin endpoint for partial product updates. Any subset of the core fields
 * may be provided. If `sizes` is provided, the product's sizes are replaced
 * with the supplied set (delete existing, then create new).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const b = (body ?? {}) as Record<string, unknown>;
    const data: Prisma.ProductUncheckedUpdateInput = {};

    // Optional string fields (must be non-empty when present).
    for (const field of ["name", "slug", "brandId", "categoryId"] as const) {
      if (b[field] !== undefined) {
        if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
          return NextResponse.json(
            { success: false, message: `Field '${field}' must be a non-empty string.` },
            { status: 400 },
          );
        }
        data[field] = (b[field] as string).trim();
      }
    }

    // Optional numeric prices.
    for (const field of ["priceTjs", "priceUsd"] as const) {
      if (b[field] !== undefined) {
        if (typeof b[field] !== "number" || !(b[field] as number >= 0)) {
          return NextResponse.json(
            { success: false, message: `Field '${field}' must be a non-negative number.` },
            { status: 400 },
          );
        }
        data[field] = b[field] as number;
      }
    }

    // Optional nullable text fields.
    if (b.description !== undefined) {
      data.description = typeof b.description === "string" ? b.description : null;
    }
    if (b.composition !== undefined) {
      data.composition = typeof b.composition === "string" ? b.composition : null;
    }
    if (b.color !== undefined) {
      data.color = typeof b.color === "string" ? b.color : null;
    }

    // Optional boolean flags.
    for (const field of ["isActive", "isFeatured", "isNew"] as const) {
      if (b[field] !== undefined) {
        if (typeof b[field] !== "boolean") {
          return NextResponse.json(
            { success: false, message: `Field '${field}' must be a boolean.` },
            { status: 400 },
          );
        }
        data[field] = b[field] as boolean;
      }
    }

    // Optional sizes: replace the whole set when provided.
    let sizes: SizeInput[] | null;
    try {
      sizes = parseSizes(b.sizes);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Invalid sizes",
        },
        { status: 400 },
      );
    }
    if (sizes) {
      data.sizes = { deleteMany: {}, create: sizes };
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { sizes: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Product not found." },
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "A product with this slug already exists." },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { success: false, message: "Invalid brandId or categoryId." },
          { status: 400 },
        );
      }
    }

    console.error("PATCH /api/admin/products/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 *
 * Soft delete per spec 3.3: the product is hidden by setting `isActive: false`,
 * never physically removed.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/products/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to hide product." },
      { status: 500 },
    );
  }
}
