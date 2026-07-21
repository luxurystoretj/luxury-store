import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/category-banners
 *
 * Public endpoint returning active homepage category banners, ordered for
 * display, each including the linked category's slug (catalog link target)
 * and trilingual name (alt-text fallback — banners have no alt of their own).
 */
export async function GET() {
  try {
    const banners = await prisma.categoryBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: {
          select: { slug: true, nameRu: true, nameTj: true, nameEn: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error("GET /api/category-banners failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category banners." },
      { status: 500 },
    );
  }
}
