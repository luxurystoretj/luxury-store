import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { parseSizes, type SizeInput } from "@/lib/utils/product";

/**
 * POST /api/admin/products
 *
 * Admin endpoint to create a product. Required: name, slug, priceTjs,
 * priceUsd, brandId, categoryId. Optional: description, composition, color,
 * isActive, isFeatured, isNew, and a nested `sizes` array.
 */
export async function POST(request: Request) {
  try {
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

    // Required string fields.
    for (const field of ["name", "slug", "brandId", "categoryId"] as const) {
      if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
        return NextResponse.json(
          { success: false, message: `Field '${field}' is required.` },
          { status: 400 },
        );
      }
    }

    // Required numeric prices.
    for (const field of ["priceTjs", "priceUsd"] as const) {
      if (typeof b[field] !== "number" || !(b[field] as number >= 0)) {
        return NextResponse.json(
          { success: false, message: `Field '${field}' must be a non-negative number.` },
          { status: 400 },
        );
      }
    }

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

    const data: Prisma.ProductUncheckedCreateInput = {
      name: (b.name as string).trim(),
      slug: (b.slug as string).trim(),
      brandId: (b.brandId as string).trim(),
      categoryId: (b.categoryId as string).trim(),
      priceTjs: b.priceTjs as number,
      priceUsd: b.priceUsd as number,
      description: typeof b.description === "string" ? b.description : null,
      composition: typeof b.composition === "string" ? b.composition : null,
      color: typeof b.color === "string" ? b.color : null,
      ...(typeof b.isActive === "boolean" ? { isActive: b.isActive } : {}),
      ...(typeof b.isFeatured === "boolean" ? { isFeatured: b.isFeatured } : {}),
      ...(typeof b.isNew === "boolean" ? { isNew: b.isNew } : {}),
      ...(sizes ? { sizes: { create: sizes } } : {}),
    };

    const product = await prisma.product.create({
      data,
      include: { sizes: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

    console.error("POST /api/admin/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product." },
      { status: 500 },
    );
  }
}
