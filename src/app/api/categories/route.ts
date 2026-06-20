import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/categories
 *
 * Public endpoint returning all categories ordered by name (A-Z).
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories." },
      { status: 500 },
    );
  }
}
