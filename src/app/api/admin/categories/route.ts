import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * POST /api/admin/categories
 *
 * Admin endpoint to create a category. Requires `name` and `slug`.
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

    const { name, slug } = (body ?? {}) as {
      name?: unknown;
      slug?: unknown;
    };

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

    const category = await prisma.category.create({
      data: { name: name.trim(), slug: slug.trim() },
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
