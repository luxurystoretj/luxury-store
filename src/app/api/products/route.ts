import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/products
 *
 * Public catalog endpoint. Returns active products with optional filtering
 * and sorting via query parameters:
 *   - search:   matches name_ru/tj/en or description_ru/tj/en (case-insensitive)
 *   - brand:    brand id or slug
 *   - category: category id or slug
 *   - color:    case-insensitive partial match across color_ru/tj/en
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

    // Combine the multi-field text filters with AND so search and color can
    // each be their own OR group without clobbering one another.
    const and: Prisma.ProductWhereInput[] = [];

    // Search across all trilingual name and description columns.
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

    // Color across all trilingual color columns (case-insensitive, partial).
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
