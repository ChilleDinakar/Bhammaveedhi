/**
 * Bhaama Veedhi — Product by ID API
 * GET    /api/products/[id]  -> fetch one
 * PUT    /api/products/[id]  -> update (ADMIN only)
 * DELETE /api/products/[id]  -> delete (ADMIN only)
 *
 * `images` is stored as a JSON string[] and (de)serialized here.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((u) => typeof u === "string");
    return [];
  } catch {
    return [];
  }
}

function serialize(p: {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  previousPrice: number | null;
  images: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    currentPrice: p.currentPrice,
    previousPrice: p.previousPrice,
    images: parseImages(p.images),
    category: p.category,
    inStock: p.inStock,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: serialize(product) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, currentPrice, previousPrice, images, category, inStock } = body;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Only update images when explicitly provided (array form)
    let imagesUpdate: string | undefined = undefined;
    if (images !== undefined) {
      let cleaned = Array.isArray(images)
        ? images.filter((u: unknown) => typeof u === "string" && String(u).trim() !== "")
        : [];
      if (cleaned.length === 0) {
        cleaned = ["/products/necklace-vine.png"];
      }
      imagesUpdate = JSON.stringify(cleaned);
    }

    const product = await db.product.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title) : undefined,
        description: description !== undefined ? String(description) : undefined,
        currentPrice: currentPrice !== undefined ? Number(currentPrice) : undefined,
        previousPrice:
          previousPrice === undefined
            ? undefined
            : previousPrice === null
            ? null
            : Number(previousPrice),
        images: imagesUpdate,
        category:
          category !== undefined
            ? String(category).trim() || "All"
            : undefined,
        inStock: inStock !== undefined ? Boolean(inStock) : undefined,
      },
    });

    return NextResponse.json({ product: serialize(product) });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
