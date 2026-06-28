import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/brands/[id]
 *
 * Admin endpoint for partial updates of a brand.
 * Accepts any subset of: `name`, `slug`, `descriptionRu`, `descriptionTj`,
 * `descriptionEn`, `logoUrl`.
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

    const b = (body ?? {}) as Record<string, unknown>;
    const { name, slug } = b;

    const data: Prisma.BrandUpdateInput = {};

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
    for (const field of ["descriptionRu", "descriptionTj", "descriptionEn"] as const) {
      if (b[field] !== undefined) {
        data[field] = typeof b[field] === "string" ? (b[field] as string) : null;
      }
    }
    if (b.logoUrl !== undefined) {
      data.logoUrl = typeof b.logoUrl === "string" ? b.logoUrl : null;
    }

    const brand = await prisma.brand.update({ where: { id }, data });

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Brand not found." },
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "A brand with this slug already exists." },
          { status: 409 },
        );
      }
    }

    console.error("PATCH /api/admin/brands/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update brand." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/brands/[id]
 *
 * Admin endpoint to delete a brand. Related products cascade at the DB level.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Brand not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/brands/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete brand." },
      { status: 500 },
    );
  }
}
