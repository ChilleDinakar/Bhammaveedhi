/**
 * Bhaama Veedhi — Product by ID API
 * GET    /api/products/[id]  -> fetch one
 * PUT    /api/products/[id]  -> update (ADMIN only)
 * DELETE /api/products/[id]  -> delete (ADMIN only)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

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
    return NextResponse.json({ product });
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
    const { title, description, currentPrice, previousPrice, imageUrl, category, inStock } = body;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
        imageUrl: imageUrl !== undefined ? String(imageUrl) : undefined,
        category: category !== undefined ? String(category) : undefined,
        inStock: inStock !== undefined ? Boolean(inStock) : undefined,
      },
    });

    return NextResponse.json({ product });
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
