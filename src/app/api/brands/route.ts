import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/brands
 *
 * Public endpoint returning all brands ordered by name (A-Z).
 */
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("GET /api/brands failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands." },
      { status: 500 },
    );
  }
}
