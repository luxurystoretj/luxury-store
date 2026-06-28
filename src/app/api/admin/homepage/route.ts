import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * PATCH /api/admin/homepage
 *
 * Admin endpoint to update a single homepage section. The target section is
 * identified by `id` or `sectionKey`. Updatable fields: `title{Ru,Tj,En}`,
 * `subtitle{Ru,Tj,En}`, `imageUrl`, `videoUrl`, `isActive`.
 */
export async function PATCH(request: Request) {
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

    // Determine which section to update (id takes precedence over sectionKey).
    let where: Prisma.HomepageSectionWhereUniqueInput;
    if (typeof b.id === "string" && b.id.trim()) {
      where = { id: b.id.trim() };
    } else if (typeof b.sectionKey === "string" && b.sectionKey.trim()) {
      where = { sectionKey: b.sectionKey.trim() };
    } else {
      return NextResponse.json(
        { success: false, message: "Provide 'id' or 'sectionKey' to identify the section." },
        { status: 400 },
      );
    }

    const data: Prisma.HomepageSectionUpdateInput = {};

    // Nullable text fields: a string sets the value, null clears it.
    for (const field of [
      "titleRu",
      "titleTj",
      "titleEn",
      "subtitleRu",
      "subtitleTj",
      "subtitleEn",
      "imageUrl",
      "videoUrl",
    ] as const) {
      if (b[field] !== undefined) {
        if (b[field] === null) {
          data[field] = null;
        } else if (typeof b[field] === "string") {
          data[field] = b[field] as string;
        } else {
          return NextResponse.json(
            { success: false, message: `Field '${field}' must be a string or null.` },
            { status: 400 },
          );
        }
      }
    }

    if (b.isActive !== undefined) {
      if (typeof b.isActive !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Field 'isActive' must be a boolean." },
          { status: 400 },
        );
      }
      data.isActive = b.isActive;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No updatable fields provided." },
        { status: 400 },
      );
    }

    const section = await prisma.homepageSection.update({ where, data });

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Homepage section not found." },
        { status: 404 },
      );
    }

    console.error("PATCH /api/admin/homepage failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update homepage section." },
      { status: 500 },
    );
  }
}
