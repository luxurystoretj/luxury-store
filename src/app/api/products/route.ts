import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/products
 *
 * Public catalog endpoint. Returns active products with optional filtering
 * and sorting via query parameters:
 *   - search:   matches product name or description (case-insensitive)
 *   - brand:    brand id or slug
 *   - category: category id or slug
 *   - color:    matched inside name or description (no dedicated color column)
 *   - size:     only products having that size in stock (quantity > 0)
 *   - sort:     "new" | "price_asc" | "price_desc" (default: newest first)
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

    // Active products only is mandatory.
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // No dedicated color column: search the color term in name or description.
    if (color) {
      where.AND = [
        {
          OR: [
            { name: { contains: color, mode: "insensitive" } },
            { description: { contains: color, mode: "insensitive" } },
          ],
        },
      ];
    }

    // Brand can be provided either as id or slug.
    if (brand) {
      where.brand = { is: { OR: [{ id: brand }, { slug: brand }] } };
    }

    // Category can be provided either as id or slug.
    if (category) {
      where.category = { is: { OR: [{ id: category }, { slug: category }] } };
    }

    // Only products that have the requested size available in stock.
    if (size) {
      where.sizes = { some: { size, quantity: { gt: 0 } } };
    }

    // Sorting.
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
        sizes: {
          where: { quantity: { gt: 0 } },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 },
    );
  }
}
