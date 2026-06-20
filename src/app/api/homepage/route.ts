import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/homepage
 *
 * Public endpoint returning the content of all active homepage sections.
 */
export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
    });

    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("GET /api/homepage failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch homepage content." },
      { status: 500 },
    );
  }
}
