/**
 * Bhaama Veedhi — Image Upload API
 * (Replaces Firebase Storage — zero-cost local file storage.)
 * POST /api/upload  (ADMIN only)
 * Accepts multipart/form-data with a single `file` field.
 * Saves to /public/uploads and returns the public URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required. Please sign in as admin." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate type & size (max 10MB)
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image format (${file.type || "unknown"}). Allowed: PNG, JPG, WEBP, GIF, AVIF.` },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.` },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const rawExt = file.name.split(".").pop()?.toLowerCase();
    const ext = rawExt && ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(rawExt)
      ? rawExt
      : "png";

    const safeName = `${crypto.randomBytes(12).toString("hex")}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, bytes);

    return NextResponse.json({
      url: `/uploads/${safeName}`,
      name: safeName,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed on the server. Please try again." },
      { status: 500 }
    );
  }
}

