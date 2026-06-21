import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/categories/[id]
 *
 * Admin endpoint for partial updates of a category.
 * Accepts any subset of: `name`, `slug`.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

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

    const data: Prisma.CategoryUpdateInput = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { success: false, message: "Field 'name' must be a non-empty string." },
          { status: 400 },
        );
      }
      data.name = name.trim();
    }
    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return NextResponse.json(
          { success: false, message: "Field 'slug' must be a non-empty string." },
          { status: 400 },
        );
      }
      data.slug = slug.trim();
    }

    const category = await prisma.category.update({ where: { id }, data });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Category not found." },
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "A category with this slug already exists.",
          },
          { status: 409 },
        );
      }
    }

    console.error("PATCH /api/admin/categories/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 *
 * Admin endpoint to delete a category. Related products cascade at the DB level.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/categories/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category." },
      { status: 500 },
    );
  }
}
