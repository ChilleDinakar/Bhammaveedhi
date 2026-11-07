/**
 * Bhaama Veedhi — Products API
 * GET  /api/products          -> list all (optionally filter by ?category=)
 * POST /api/products          -> create (ADMIN only)
 *
 * The `images` column stores a JSON-encoded string[]; this layer
 * serializes on write and deserializes on read so the client always
 * sees `images: string[]`.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/** Parse the stored JSON images string into a clean string[]. */
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

/** Shape a raw Prisma product row into the client-facing product. */
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

/** Coerce an incoming `images` value into a clean string[] (or null). */
function coerceImages(value: unknown): string[] | null {
  if (value === undefined) return null;
  if (!Array.isArray(value)) return null;
  const cleaned = value.filter((u) => typeof u === "string" && u.trim() !== "");
  return cleaned;
}

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const rows = await db.product.findMany({
      where: category && category !== "All" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });
    const products = rows.map(serialize);
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
    const { title, description, currentPrice, previousPrice, images, category, inStock } = body;

    const parsedImages = coerceImages(images) ?? [];
    const cleanImages = parsedImages.length > 0 ? parsedImages : ["/products/necklace-vine.png"];

    if (!title || !description || currentPrice === undefined || currentPrice === null || isNaN(Number(currentPrice))) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, and valid currentPrice" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        title: String(title),
        description: String(description),
        currentPrice: Number(currentPrice),
        previousPrice: previousPrice ? Number(previousPrice) : null,
        images: JSON.stringify(cleanImages),
        category: category ? String(category).trim() || "All" : "All",
        inStock: inStock !== undefined ? Boolean(inStock) : true,
      },
    });

    return NextResponse.json({ product: serialize(product) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
