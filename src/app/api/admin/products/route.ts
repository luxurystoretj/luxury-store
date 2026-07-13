import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { parseSizes, type SizeInput } from "@/lib/utils/product";

/**
 * GET /api/admin/products
 *
 * Admin listing: returns ALL products (no `isActive` filter — the owner must
 * see hidden/soft-deleted rows). Supports the same query params as the public
 * route (search, brand, category, color, size, sort), only without forcing
 * `isActive`. Includes brand, category, all sizes, and images.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const category = searchParams.get("category")?.trim();
    const color = searchParams.get("color")?.trim();
    const size = searchParams.get("size")?.trim();
    const sort = searchParams.get("sort")?.trim();

    const where: Prisma.ProductWhereInput = {};
    const and: Prisma.ProductWhereInput[] = [];

    if (search) {
      and.push({
        OR: [
          { nameRu: { contains: search, mode: "insensitive" } },
          { nameTj: { contains: search, mode: "insensitive" } },
          { nameEn: { contains: search, mode: "insensitive" } },
          { descriptionRu: { contains: search, mode: "insensitive" } },
          { descriptionTj: { contains: search, mode: "insensitive" } },
          { descriptionEn: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (color) {
      and.push({
        OR: [
          { colorRu: { contains: color, mode: "insensitive" } },
          { colorTj: { contains: color, mode: "insensitive" } },
          { colorEn: { contains: color, mode: "insensitive" } },
        ],
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    if (brand) {
      where.brand = { is: { OR: [{ id: brand }, { slug: brand }] } };
    }
    if (category) {
      where.category = { is: { OR: [{ id: category }, { slug: category }] } };
    }
    if (size) {
      where.sizes = { some: { size, quantity: { gt: 0 } } };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sort) {
      case "price_asc":
        orderBy = { priceTjs: "asc" };
        break;
      case "price_desc":
        orderBy = { priceTjs: "desc" };
        break;
      case "new":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        brand: true,
        category: true,
        sizes: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/admin/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/products
 *
 * Admin endpoint to create a product. Required: nameRu, nameTj, nameEn, slug,
 * priceTjs, priceUsd, brandId, categoryId. Optional: description{Ru,Tj,En},
 * composition{Ru,Tj,En}, color{Ru,Tj,En}, isActive, isFeatured, isNew, and a
 * nested `sizes` array.
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
    for (const field of [
      "nameRu",
      "nameTj",
      "nameEn",
      "slug",
      "brandId",
      "categoryId",
    ] as const) {
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
      nameRu: (b.nameRu as string).trim(),
      nameTj: (b.nameTj as string).trim(),
      nameEn: (b.nameEn as string).trim(),
      slug: (b.slug as string).trim(),
      brandId: (b.brandId as string).trim(),
      categoryId: (b.categoryId as string).trim(),
      priceTjs: b.priceTjs as number,
      priceUsd: b.priceUsd as number,
      descriptionRu: typeof b.descriptionRu === "string" ? b.descriptionRu : null,
      descriptionTj: typeof b.descriptionTj === "string" ? b.descriptionTj : null,
      descriptionEn: typeof b.descriptionEn === "string" ? b.descriptionEn : null,
      compositionRu: typeof b.compositionRu === "string" ? b.compositionRu : null,
      compositionTj: typeof b.compositionTj === "string" ? b.compositionTj : null,
      compositionEn: typeof b.compositionEn === "string" ? b.compositionEn : null,
      colorRu: typeof b.colorRu === "string" ? b.colorRu : null,
      colorTj: typeof b.colorTj === "string" ? b.colorTj : null,
      colorEn: typeof b.colorEn === "string" ? b.colorEn : null,
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
