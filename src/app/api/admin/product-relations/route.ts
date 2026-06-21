import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * POST /api/admin/product-relations
 *
 * Admin endpoint to create a "Matches with this" relation between two
 * products. Requires `productId` and `relatedProductId`, which must differ.
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

    const { productId, relatedProductId } = (body ?? {}) as {
      productId?: unknown;
      relatedProductId?: unknown;
    };

    if (typeof productId !== "string" || !productId.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'productId' is required." },
        { status: 400 },
      );
    }
    if (typeof relatedProductId !== "string" || !relatedProductId.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'relatedProductId' is required." },
        { status: 400 },
      );
    }
    if (productId.trim() === relatedProductId.trim()) {
      return NextResponse.json(
        { success: false, message: "A product cannot be related to itself." },
        { status: 400 },
      );
    }

    const relation = await prisma.productRelation.create({
      data: {
        productId: productId.trim(),
        relatedProductId: relatedProductId.trim(),
      },
    });

    return NextResponse.json({ success: true, data: relation }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "This relation already exists." },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { success: false, message: "Invalid productId or relatedProductId." },
          { status: 400 },
        );
      }
    }

    console.error("POST /api/admin/product-relations failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create relation." },
      { status: 500 },
    );
  }
}
