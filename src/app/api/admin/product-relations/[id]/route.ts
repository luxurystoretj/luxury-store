import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * DELETE /api/admin/product-relations/[id]
 *
 * Admin endpoint to remove a product relation by its id.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.productRelation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Relation not found." },
        { status: 404 },
      );
    }

    console.error("DELETE /api/admin/product-relations/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete relation." },
      { status: 500 },
    );
  }
}
