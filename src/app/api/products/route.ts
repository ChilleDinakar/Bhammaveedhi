/**
 * Bhaama Veedhi — Products API
 * GET  /api/products          -> list all (optionally filter by ?category=)
 * POST /api/products          -> create (ADMIN only)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const products = await db.product.findMany({
      where: category && category !== "All" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { title, description, currentPrice, previousPrice, imageUrl, category, inStock } = body;

    if (!title || !description || !currentPrice || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, currentPrice, imageUrl" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        title: String(title),
        description: String(description),
        currentPrice: Number(currentPrice),
        previousPrice: previousPrice ? Number(previousPrice) : null,
        imageUrl: String(imageUrl),
        category: category ? String(category) : "All",
        inStock: inStock !== undefined ? Boolean(inStock) : true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
