import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * POST /api/admin/brands
 *
 * Admin endpoint to create a brand. Requires `name` and `slug`.
 * Optional: `descriptionRu`, `descriptionTj`, `descriptionEn`, `logoUrl`.
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
    const { name, slug } = b;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'name' is required." },
        { status: 400 },
      );
    }
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'slug' is required." },
        { status: 400 },
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        descriptionRu: typeof b.descriptionRu === "string" ? b.descriptionRu : null,
        descriptionTj: typeof b.descriptionTj === "string" ? b.descriptionTj : null,
        descriptionEn: typeof b.descriptionEn === "string" ? b.descriptionEn : null,
        logoUrl: typeof b.logoUrl === "string" ? b.logoUrl : null,
      },
    });

    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "A brand with this slug already exists." },
        { status: 409 },
      );
    }

    console.error("POST /api/admin/brands failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create brand." },
      { status: 500 },
    );
  }
}
