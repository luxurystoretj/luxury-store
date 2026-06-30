import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * POST /api/admin/categories
 *
 * Admin endpoint to create a category. Requires `nameRu`, `nameTj`, `nameEn`
 * and `slug`.
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

    for (const field of ["nameRu", "nameTj", "nameEn", "slug"] as const) {
      if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
        return NextResponse.json(
          { success: false, message: `Field '${field}' is required.` },
          { status: 400 },
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        nameRu: (b.nameRu as string).trim(),
        nameTj: (b.nameTj as string).trim(),
        nameEn: (b.nameEn as string).trim(),
        slug: (b.slug as string).trim(),
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this slug already exists.",
        },
        { status: 409 },
      );
    }

    console.error("POST /api/admin/categories failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category." },
      { status: 500 },
    );
  }
}
