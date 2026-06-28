import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/products/[slug]
 *
 * Public endpoint returning a single active product by its slug, including
 * brand, category, all sizes (so the UI can mark out-of-stock ones), images
 * ordered by sort order, and the related products ("Matches with this").
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // In Next.js 15 route params are async and must be awaited.
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        brand: true,
        category: true,
        sizes: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        // "Matches with this": fetch the actual target product details,
        // not just the relation rows.
        relatedFrom: {
          include: {
            relatedProduct: {
              select: {
                id: true,
                nameRu: true,
                nameTj: true,
                nameEn: true,
                slug: true,
                priceTjs: true,
                priceUsd: true,
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET /api/products/[slug] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product." },
      { status: 500 },
    );
  }
}
